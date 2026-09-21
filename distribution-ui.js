'use strict';
const panel=document.createElement('section');panel.className='distribution';
const detailTitle=text('h2','不只看平均值 · V1.1');
const detailNote=text('p','同一批虚构顾客逐人对照。阈值统计使用“严格大于”，区间右端包含；中位数采用最近秩法。没有顾客时比例显示 0%，不代表真实体验。');detailNote.className='small';
const thresholdLabel=text('label','长等待阈值（秒，0–3600）'),thresholdInput=document.createElement('input');thresholdInput.id='waitThreshold';thresholdInput.type='number';thresholdInput.min=0;thresholdInput.max=3600;thresholdInput.step=1;thresholdInput.value=120;thresholdLabel.append(thresholdInput);
const detailStatus=text('p','');detailStatus.id='distributionStatus';detailStatus.setAttribute('role','status');
const tableBox=document.createElement('div');tableBox.className='table-scroll';tableBox.tabIndex=0;tableBox.setAttribute('aria-label','等待时间分布表，可横向滚动');
const pairedText=text('p','');pairedText.id='pairedSummary';
const detailExport=text('button','导出分布 CSV');detailExport.id='distributionCsv';detailExport.type='button';
panel.append(detailTitle,detailNote,thresholdLabel,detailStatus,tableBox,pairedText,detailExport);
document.querySelector('.results').insertBefore(panel,document.querySelector('.results details'));
let detailResult=null;
function renderDistribution(){
 detailResult=null;detailExport.disabled=true;tableBox.replaceChildren();pairedText.textContent='';
 if(!result){detailStatus.textContent='设置已改变，请重新比较；分布已清空，不展示旧结果。';return;}
 try{
  if(!thresholdInput.value.trim())throw Error('请填写等待阈值');
  const d=QueueDetails.analyze(result,Number(thresholdInput.value));detailResult=d;
  detailStatus.textContent=`超过 ${d.thresholdSeconds} 秒：共用 ${d.pooled.over} / ${d.pooled.count} 人（${d.pooled.overPercent.toFixed(1)}%），独立 ${d.separate.over} / ${d.separate.count} 人（${d.separate.overPercent.toFixed(1)}%）。中位数：${d.pooled.median.toFixed(1)} / ${d.separate.median.toFixed(1)} 秒。`;
  const table=document.createElement('table'),caption=text('caption','每个等待区间的人数与占比'),head=document.createElement('thead'),hr=document.createElement('tr');
  for(const title of ['等待区间','共用队列','独立队列']){const th=text('th',title);th.scope='col';hr.append(th);}head.append(hr);table.append(caption,head);const body=document.createElement('tbody');
  d.pooled.bins.forEach((bin,i)=>{const tr=document.createElement('tr'),th=text('th',bin.label);th.scope='row';tr.append(th);for(const p of ['pooled','separate']){const b=d[p].bins[i];tr.append(text('td',`${b.count} 人 / ${b.percent.toFixed(1)}%`));}body.append(tr);});table.append(body);tableBox.append(table);
  const p=d.paired;pairedText.textContent=`选择共用队列，相对独立队列：${p.shorter} 人等待更短，${p.equal} 人相同，${p.longer} 人更长。单人最大缩短 ${p.maxReduction.toFixed(1)} 秒，最大增加 ${p.maxIncrease.toFixed(1)} 秒。只比较这一次模拟，不保证每个人都更快。`;
  detailExport.disabled=false;
 }catch(e){detailStatus.textContent='分布不可用：'+e.message;}
}
thresholdInput.addEventListener('input',renderDistribution);
const computeOriginal=compute,invalidateOriginal=invalidate;
compute=function(){computeOriginal();renderDistribution();};
invalidate=function(){invalidateOriginal();renderDistribution();};
// Existing listeners retain the original invalidation function, so observe their input too.
ids.forEach(id=>$(id).addEventListener('input',renderDistribution));
detailExport.onclick=()=>{if(detailResult)save(new Blob(['\ufeff'+QueueDetails.csv(detailResult)],{type:'text/csv;charset=utf-8'}),'queue-distribution.csv');};
renderDistribution();
