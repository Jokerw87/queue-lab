(function(root,factory){const api=factory(typeof module==='object'?require('./engine.js'):root.QueueLab);if(typeof module==='object'&&module.exports)module.exports=api;else root.QueueProject=api;})(typeof globalThis==='object'?globalThis:this,function(engine){
 'use strict';
 const limit=8192,keys=['minutes','rate','service','servers','seed','arrivals','services'];
 function exact(object,expected){if(!object||typeof object!=='object'||Array.isArray(object)||Object.getPrototypeOf(object)!==Object.prototype)throw Error('需要普通JSON对象');const actual=Object.keys(object);if(actual.length!==expected.length||actual.some(k=>!expected.includes(k)))throw Error('字段缺失或含不支持的字段');}
 function config(input){exact(input,keys);for(const key of keys.slice(0,5))if(typeof input[key]!=='number')throw Error('参数必须是数字：'+key);engine.validate(input);return Object.fromEntries(keys.map(k=>[k,input[k]]));}
 function serialize(input){return JSON.stringify({format:'queue-lab-project',version:1,config:config(input)},null,2);}
 function parse(raw){if(typeof raw!=='string'||new TextEncoder().encode(raw).length>limit)throw Error('项目文件最大8KiB');let p;try{p=JSON.parse(raw);}catch{throw Error('JSON格式无效');}exact(p,['format','version','config']);if(p.format!=='queue-lab-project'||p.version!==1)throw Error('不支持的项目格式或版本');return config(p.config);}
 return{parse,serialize,limit};
});
