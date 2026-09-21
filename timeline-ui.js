'use strict';
const timelinePanel=document.createElement('section');timelinePanel.className='distribution';
timelinePanel.append(text('h2','跟着一位顾客看时间 · V1.2'),text('p','从到达、等待到服务结束，两种排法使用同一条时间轴。只展示当前选中的虚构顾客，不代表总体结果。橙色为等待，绿色为服务。'));
const customerLabel=text('label','顾客编号'),customerInput=document.createElement('input');customerInput.id='timelineCustomer';customerInput.type='number';customerInput.min=1;customerInput.step=1;customerInput.value=1;customerLabel.append(customerInput);
const timelineStatus=text('p','');timelineStatus.id='timelineStatus';timelineStatus.setAttribute('role','status');
const timelineCanvas=document.createElement('canvas');timelineCanvas.id='timeline';timelineCanvas.width=1100;timelineCanvas.height=300;timelineCanvas.setAttribute('aria-label','当前顾客两种排法的等待及服务；详细数值见下方文字');
const timelineDetails=document.createElement('div');timelineDetails.id='timelineDetails';
const timelineExport=text('button','保存当前顾客时间线 PNG');timelineExport.id='timelinePng';timelineExport.type='button';
timelinePanel.append(customerLabel,timelineStatus,timelineCanvas,timelineDetails,timelineExport);document.querySelector('.results').insertBefore(timelinePanel,document.querySelector('.results details'));
let timelineValid=false;
function renderTimeline(){
 timelineValid=false;timelineExport.disabled=true;timelineDetails.replaceChildren();const g=timelineCanvas.getContext('2d');g.fillStyle='#faf8f1';g.fillRect(0,0,1100,300);
 if(!result){timelineStatus.textContent='设置已改变，请重新比较；时间线已清空。';return;}
 customerInput.max=result.jobs.length;
 if(!result.jobs.length){timelineStatus.textContent='本轮没有顾客，没有可展示的时间线。';return;}
 const raw=customerInput.value.trim(),id=Number(raw);
 if(!/^\d+$/.test(raw)||!Number.isInteger(id)||id<1||id>result.jobs.length){timelineStatus.textContent='请输入1至'+result.jobs.length+'之间的整数顾客编号。';return;}
 const records=['pooled','separate'].map(p=>result[p].records[id-1]);const maxT=Math.max(...records.map(r=>r.end)),left=170,width=880,x=t=>left+t/maxT*width;
 g.font='18px system-ui';g.fillStyle='#203c35';g.fillText('虚构顾客 '+id+' · 种子 '+result.config.seed+' · 非门店预测',30,30);g.fillText('橙色：等待 / 绿色：服务 · 横轴：本轮开始后秒数',570,30);
 for(let i=0;i<=4;i++){const t=maxT*i/4;g.strokeStyle='#ccd6ca';g.beginPath();g.moveTo(x(t),55);g.lineTo(x(t),230);g.stroke();g.fillText(t.toFixed(1)+'s',x(t)-20,265);}
 records.forEach((r,i)=>{const y=90+i*90,name=i?'独立队列':'共用队列';g.fillStyle='#203c35';g.fillText(name,20,y+22);g.fillStyle='#bd4a29';g.fillRect(x(r.arrival),y,x(r.start)-x(r.arrival),32);g.fillStyle='#26765f';g.fillRect(x(r.start),y,x(r.end)-x(r.start),32);g.fillStyle='#203c35';g.fillText('窗口'+(r.lane+1),20,y+45);timelineDetails.append(text('p',name+'：到达 '+r.arrival.toFixed(3)+' 秒；开始 '+r.start.toFixed(3)+' 秒；结束 '+r.end.toFixed(3)+' 秒；等待 '+r.wait.toFixed(3)+' 秒；服务 '+r.service.toFixed(3)+' 秒；窗口 '+(r.lane+1)+'。'));});
 timelineStatus.textContent='当前顾客 '+id+' / '+result.jobs.length+'。横轴为本轮开始后的秒数；切换顾客会重新缩放，不宜跨图直接比较条形长度。';timelineValid=true;timelineExport.disabled=false;
}
customerInput.addEventListener('input',renderTimeline);
const beforeTimelineCompute=compute;compute=function(){beforeTimelineCompute();renderTimeline();};
ids.forEach(id=>$(id).addEventListener('input',renderTimeline));
timelineExport.onclick=()=>{if(!timelineValid)return;const snapshot=timelineCanvas.toDataURL('image/png'),a=document.createElement('a');a.href=snapshot;a.download='queue-customer-timeline.png';a.click();};
renderTimeline();
