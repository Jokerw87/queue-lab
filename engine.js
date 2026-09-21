(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QueueLab = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const MAX_CUSTOMERS = 10000;
  function validate(c) {
    for (const [k, low, high] of [['minutes',5,120],['rate',0,20],['service',5,300],['servers',1,8],['seed',0,4294967295]]) {
      if (!Number.isFinite(c[k]) || c[k] < low || c[k] > high) throw Error('参数超出范围：' + k);
    }
    if (!Number.isInteger(c.servers) || !Number.isInteger(c.seed)) throw Error('窗口和种子必须为整数');
    if (!['regular','random'].includes(c.arrivals) || !['fixed','random'].includes(c.services)) throw Error('分布设置无效');
  }
  function rng(seed) {
    let s=seed>>>0;
    return () => {s=(Math.imul(1664525,s)+1013904223)>>>0; return (s+.5)/4294967296;};
  }
  function generate(c) {
    validate(c);
    if(c.rate===0) return [];
    const arrivals=rng(c.seed),service=rng((c.seed^0x9e3779b9)>>>0),jobs=[];
    let t=0;
    for(;;) {
      t += c.arrivals==='regular' ? 60/c.rate : -Math.log(1-arrivals())*60/c.rate;
      if(t>=c.minutes*60) break;
      if(jobs.length>=MAX_CUSTOMERS) throw Error('顾客超过10000，请降低客流或时长');
      jobs.push({id:jobs.length+1,arrival:t,service:c.services==='fixed'?c.service:-Math.log(1-service())*c.service});
    }
    return jobs;
  }
  function simulate(jobs, servers, policy, horizon) {
    if(!Array.isArray(jobs)||jobs.length>MAX_CUSTOMERS||!Number.isInteger(servers)||servers<1||servers>8||!['pooled','separate'].includes(policy)||!Number.isFinite(horizon)||horizon<=0) throw Error('模拟输入无效');
    let previous=-Infinity;
    jobs.forEach(j=>{if(!Number.isFinite(j.arrival)||!Number.isFinite(j.service)||j.arrival<0||j.arrival>=horizon||j.arrival<previous||j.service<=0)throw Error('顾客时间无效');previous=j.arrival;});
    const free=Array(servers).fill(0),lanes=Array.from({length:servers},()=>[]),heads=Array(servers).fill(0),records=[];
    for(const j of jobs) {
      let lane=0;
      if(policy==='pooled') {
        for(let k=1;k<servers;k++) if(free[k]<free[lane])lane=k;
      } else {
        for(let k=0;k<servers;k++) while(heads[k]<lanes[k].length && lanes[k][heads[k]]<=j.arrival)heads[k]++;
        for(let k=1;k<servers;k++) if(lanes[k].length-heads[k]<lanes[lane].length-heads[lane])lane=k;
      }
      const start=Math.max(j.arrival,free[lane]),end=start+j.service;
      free[lane]=end;lanes[lane].push(end);records.push({...j,lane,start,end,wait:start-j.arrival});
    }
    const sorted=records.map(r=>r.wait).sort((a,b)=>a-b),events=[];
    for(const r of records) if(r.wait>0)events.push([r.arrival,1],[r.start,-1]);
    events.sort((a,b)=>a[0]-b[0]);let n=0,maxQueue=0;const curve=[[0,0]];
    for(let i=0;i<events.length;) {const time=events[i][0];while(i<events.length&&events[i][0]===time)n+=events[i++][1];curve.push([time,n]);maxQueue=Math.max(maxQueue,n);}
    const endTime=Math.max(horizon,...free);curve.push([endTime,0]);
    const mean=sorted.length?sorted.reduce((a,b)=>a+b,0)/sorted.length:0;
    const busy=records.reduce((sum,r)=>sum+Math.max(0,Math.min(r.end,horizon)-Math.min(r.start,horizon)),0);
    return {policy,records,curve,metrics:{count:records.length,meanWait:mean,p95Wait:sorted.length?sorted[Math.ceil(sorted.length*.95)-1]:0,maxWait:sorted.at(-1)||0,maxQueue,completedByClose:records.filter(r=>r.end<=horizon).length,utilization:busy/(horizon*servers),clearAt:endTime}};
  }
  function run(config) {
    const jobs=generate(config),horizon=config.minutes*60;
    return {schema:'queue-lab-v1',config:{...config},horizon,jobs,pooled:simulate(jobs,config.servers,'pooled',horizon),separate:simulate(jobs,config.servers,'separate',horizon)};
  }
  function csv(result) {
    const lines=['policy,id,arrival_seconds,service_seconds,window,start_seconds,end_seconds,wait_seconds'];
    for(const p of ['pooled','separate']) for(const r of result[p].records) lines.push([p,r.id,r.arrival,r.service,r.lane+1,r.start,r.end,r.wait].join(','));
    return lines.join('\r\n');
  }
  return {validate,rng,generate,simulate,run,csv};
});
