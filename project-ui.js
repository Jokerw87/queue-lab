'use strict';
const projectPanel=document.createElement('section');projectPanel.className='distribution';projectPanel.append(text('h2','保存或重开实验参数 · V1.3'),text('p','只保存七项模拟参数。导入后本地重新计算，不读取文件内的顾客、指标或图形结果。旧版完整结果JSON不是项目文件。'));
const projectSave=text('button','保存参数项目 JSON');projectSave.id='projectSave';projectSave.type='button';
const projectLabel=text('label','导入参数项目（JSON，最大8KiB）'),projectInput=document.createElement('input');projectInput.id='projectInput';projectInput.type='file';projectInput.accept='.json,application/json';projectLabel.append(projectInput);
const projectStatus=text('p','');projectStatus.id='projectStatus';projectStatus.setAttribute('role','status');projectPanel.append(projectSave,projectLabel,projectStatus);document.querySelector('.results').prepend(projectPanel);
let projectReading=false;
function projectControls(){projectSave.disabled=!result||projectReading;projectInput.disabled=projectReading;}
const beforeProjectCompute=compute;compute=function(){beforeProjectCompute();projectControls();};ids.forEach(id=>$(id).addEventListener('input',projectControls));
projectSave.onclick=()=>{if(!result||projectReading)return;save(new Blob([QueueProject.serialize(result.config)],{type:'application/json'}),'queue-project.json');projectStatus.textContent='已请求保存参数项目；请检查下载文件。不会自动备份。';};
projectInput.onchange=async()=>{
 if(projectReading)return;const file=projectInput.files[0];projectInput.value='';if(!file)return;projectReading=true;projectControls();
 try{
  if(file.size>QueueProject.limit)throw Error('项目文件最大8KiB');
  if(!/\.json$/i.test(file.name))throw Error('请选择JSON项目文件');
  const candidate=QueueProject.parse(await file.text());
  // Check computation before replacing controls; imported results are never used.
  QueueLab.run(candidate);
  if(!confirm('用导入参数替换当前设置并重新计算？未保存的当前参数将被替换。')){projectStatus.textContent='已取消导入，当前设置和结果保持不变。';return;}
  for(const id of ids)$(id).value=candidate[id];customerInput.value=1;compute();projectStatus.textContent='参数已导入并重新计算；时间线重置为顾客1，分布阈值仍使用当前设置。';
 }catch(e){projectStatus.textContent='导入失败：'+e.message+' 当前设置和结果未替换。';}
 finally{projectReading=false;projectControls();}
};projectControls();
