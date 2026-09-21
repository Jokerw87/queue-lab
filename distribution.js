(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QueueDetails=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const bounds=[0,30,60,120,300,Infinity],labels=['0 秒','(0, 30] 秒','(30, 60] 秒','(60, 120] 秒','(120, 300] 秒','> 300 秒'];
function analyze(result,threshold){
 if(!Number.isInteger(threshold)||threshold<0||threshold>3600)throw Error('等待阈值须为 0–3600 的整数秒');
 const a=result?.pooled?.records,b=result?.separate?.records;
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length||a.length>10000)throw Error('比较记录无效');
 const seen=new Set();
 for(let i=0;i<a.length;i++){const x=a[i],y=b[i];if(!x||!y||!Number.isInteger(x.id)||seen.has(x.id)||x.id!==y.id||x.arrival!==y.arrival||x.service!==y.service||![x.wait,y.wait,x.arrival,x.service].every(Number.isFinite)||x.wait<0||y.wait<0||x.arrival<0||x.service<=0)throw Error('逐人记录不匹配或时间无效');seen.add(x.id);}
 function summarize(rows){const waits=rows.map(r=>r.wait).sort((x,y)=>x-y),counts=bounds.map(()=>0);for(const w of waits)counts[bounds.findIndex(v=>w<=v)]++;return {count:rows.length,median:waits.length?waits[Math.ceil(waits.length*.5)-1]:0,over:waits.filter(w=>w>threshold).length,overPercent:rows.length?100*waits.filter(w=>w>threshold).length/rows.length:0,bins:counts.map((count,i)=>({label:labels[i],count,percent:rows.length?100*count/rows.length:0}))};}
 const paired={shorter:0,equal:0,longer:0,maxReduction:0,maxIncrease:0};
 for(let i=0;i<a.length;i++){const delta=a[i].wait-b[i].wait;if(delta<0)paired.shorter++;else if(delta>0)paired.longer++;else paired.equal++;paired.maxReduction=Math.max(paired.maxReduction,-delta);paired.maxIncrease=Math.max(paired.maxIncrease,delta);}
 return {schema:'queue-distribution-v1',thresholdSeconds:threshold,comparison:'pooled_wait_minus_separate_wait',pooled:summarize(a),separate:summarize(b),paired};
}
function csv(d){const names=['wait_eq_0','wait_gt_0_le_30','wait_gt_30_le_60','wait_gt_60_le_120','wait_gt_120_le_300','wait_gt_300'];const lines=['section,policy,metric,value,unit'];for(const policy of ['pooled','separate']){const m=d[policy];for(const [metric,value,unit] of [['customers',m.count,'people'],['median_wait',m.median,'seconds'],['strictly_over_threshold',m.over,'people'],['over_threshold_percent',m.overPercent,'percent'],['threshold',d.thresholdSeconds,'seconds']])lines.push(['summary',policy,metric,value,unit].join(','));m.bins.forEach((b,i)=>lines.push(['distribution',policy,names[i],b.count,'people'].join(',')));}for(const [k,v] of Object.entries(d.paired))lines.push(['paired','pooled_vs_separate',k,v,k.startsWith('max')?'seconds':'people'].join(','));return lines.join('\r\n');}
return {analyze,csv,labels:labels.slice()};
});
