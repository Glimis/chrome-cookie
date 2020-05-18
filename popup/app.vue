<template>
    <div>

        <table class="table">
            <thead>
                <tr>
                    <th class="slh"  style="width:120px" title="标签">标签</th>
                    <th class="slh" title="value">value</th>
                    <th style="width:180px">
                     
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tag,index) in tags" :key="index">
                    <td class="slh" v-text="tag.name" :title="tag.name"></td>
                    <td class="slh" v-text="tag.value" :title="JSON.stringify(tag.value)"></td>
                    <td>
                        <button type="button" class="btn btn-danger" @click="removeTag(tag)" title="删除缓存的cookie">删</button>
                        <button type="button" class="btn btn-info" @click="addCookie(tag)" title="将该cookie,注入到当前页面">注</button>
                    </td>
                </tr>
            </tbody>
        </table>  
        <form class="form-inline  mb-2 mt-2">
            <div class="form-group col-6">
              <label class="slh" style="display: inline-block;" v-text="url" :title="url"></label>
            </div>
            <div class="form-group col-4">
                <input type="text" v-model="tag" title="标签" class="form-control">
            </div>
            <div class="form-group col-2">
                 <button type="button" class="btn btn-primary" @click="add" title="缓存该页cookie">保存</button>
            </div>
        </form>
        <table class="table">
            <thead>
                <tr>
                    <th class="slh" style="width:120px" title="name">name</th>
                    <th class="slh" style="width:120px" title="value">value</th>
                    <th class="slh" style="width:120px" title="domain">domain</th>
                    <th class="slh" style="width:60px" title="path">path</th>
                    
                    <th class="slh" style="width:60px" title="hostOnly">hostOnly</th>
                    <th class="slh" style="width:60px" title="httpOnly">httpOnly</th>
                    
                   
                    <th class="slh" style="width:60px" title="sameSite">sameSite</th>
                    <th class="slh" style="width:60px" title="secure">secure</th>
                    <th class="slh" style="width:60px" title="session">session</th>
                    <th style="width:60px">
                        <button type="button" class="btn btn-danger" @click="remove()" title="全部删除">All</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cookie,index) in cookies" :key="index">
                    <td class="slh" v-text="cookie.name" :title="cookie.name">name</td>
                    <td class="slh" v-text="cookie.value" :title="cookie.value">value</td>
                    <td class="slh" v-text="cookie.domain" :title="cookie.domain">domain</td>
                    <td class="slh" v-text="cookie.path" :title="cookie.path">path</td>

                    <td class="slh" v-text="cookie.hostOnly" :title="cookie.hostOnly">hostOnly</td>
                    <td class="slh" v-text="cookie.httpOnly" :title="cookie.httpOnly">httpOnly</td>
                    <td class="slh" v-text="cookie.sameSite" :title="cookie.sameSite">sameSite</td>
                    <td class="slh" v-text="cookie.secure" :title="cookie.secure">secure</td>
                    <td class="slh" v-text="cookie.session" :title="cookie.session">session</td>
                    <td>
                        <button type="button" class="btn btn-danger" @click="remove(cookie)" title="删除">删</button>
                    </td>
                </tr>
            </tbody>
        </table>  
    </div> 
</template>
<script>
    export default {
        mounted(){
            // 读取当前页面cookie
            chrome.tabs.getSelected(null, (tab)=>{
                this.url = tab.url
                this.getCookie()
            });

            // 读取保存的cookie
            this.getTags();
        },
        data(){
           return {
               url:'',
               tag:'',
               cookies:[],
               tags:[]
           }
        },
        methods:{
            remove(cookie,flag = true){
                if(!this.url){
                    return;
                }
                if(cookie){
                    chrome.cookies.remove({url:this.url, name: cookie.name}, details => {
                        flag && this.getCookie()
                    });
                }else{
                    // 全部删除deb
                    this.cookies.forEach(cookie => {
                        this.remove(cookie,false)
                    });
                    this.getCookie();
                }
            },
            // 获取cookie
            getCookie(){
                this.url && chrome.cookies.getAll({url:this.url},(cookies)=>{
                    this.cookies = cookies;
                }) 
            },
            // 本地存储cookie
            add(){
                chrome.storage.local.get({tags:''}, (devtail)=>{
                    devtail.tags = devtail.tags || {};
                    devtail.tags[this.tag] = this.cookies;

                    chrome.storage.local.set(devtail, () =>{
                        this.getTags();
                    });
                });
            },
            // 获取所有标记
            getTags(){
                chrome.storage.local.get({tags:''}, (devtail)=>{
                   let tagsMap = devtail.tags || {}
                   this.tags = Object.keys(tagsMap).map((tag)=>{
                       return {
                           name:tag,
                           value:tagsMap[tag]
                       }
                   })
                });
            },
            // 根据 tag 添加cookie 
            addCookie(tag){
                // 只注入name与value  
                tag.value.forEach((cookie)=>{
                    chrome.cookies.set({
                        url:this.url,
                        name:cookie.name,
                        value:cookie.value,
                        path:'/'
                    }, (ck) =>{
                        // --》promise.all
                        this.getCookie()
                    });
                })
            },
            // 删除tag
            removeTag(tag){
                chrome.storage.local.get({tags:''}, (devtail)=>{
                    let tags = devtail.tags || {}
                    // 根据name,删除
                    delete tags[tag.name]
                    chrome.storage.local.set(devtail, () =>{
                        this.getTags();
                    });
                });
            }
        }
    }

</script>
<style lang="less">
    .table{
        table-layout: fixed;
    }
</style>