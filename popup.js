getTabDataFromLocal();

//현재 탭 가져와서 보여주는 부분

// 현재 탭의 정보
const current_info = await chrome.tabs.query({currentWindow:true, active:true});

// 현재 탭의 id와 url을 담을 틀 가져오기
const template = document.getElementById("current_tab_template");
const current_tab = template.content.firstElementChild.cloneNode(true);

const title = current_info[0].title;
const pathname = current_info[0].url;

current_tab.querySelector(".title").textContent = title;
current_tab.querySelector(".pathname").textContent = pathname;

document.querySelector("#current_tab").append(current_tab);

// 탭 저장 버튼 누르면 로컬 스토리지에 저장
document.querySelector('#add_tab').addEventListener("click", async ()=>{

    const addInfo = document.querySelector("#current_tab");
    const TabForAdd = {
        title: addInfo.querySelector(".title").textContent,
        pathname: addInfo.querySelector(".pathname").textContent
    };

    await updateTabDataToLocal(TabForAdd);
    await getTabDataFromLocal();

});

//삭제하는법
// chrome.storage.local.remove('key', function() {
//     console.log('Data with key "key" is removed from local storage.');
//   });

async function updateTabDataToLocal(updateData){
    const local = await chrome.storage.local.get('tabPreserve');
    
    try{
        await chrome.storage.local.set({tabPreserve:[...(local.tabPreserve), updateData]});
    }catch(err){
        await chrome.storage.local.set({tabPreserve:[updateData]});
    }
}

async function getTabDataFromLocal(){
    const local = (await chrome.storage.local.get('tabPreserve')).tabPreserve;
    
    const template = document.getElementById("li_tab_template");

    const elements = new Set();
    for (const tab of local) {
        const element = template.content.firstElementChild.cloneNode(true);

        element.querySelector(".title").textContent = tab.title;
        element.querySelector(".pathname").textContent = tab.pathname;
        element.querySelector("a").addEventListener("click", async () => {

            chrome.tabs.create({url:tab.pathname});
            // need to focus window as well as the active tab
            // await chrome.tabs.update(tab.id, { active: true });
            // await chrome.windows.update(tab.windowId, { focused: true });
        });
        
        element.querySelector(".delete_tab").id = tab.pathname;
        element.querySelector(".delete_tab").addEventListener("click", async(event)=>{
    
            // console.log(event.target.id);
            await deleteTabFromLocal(event.target.id);
            await getTabDataFromLocal();
        })

        elements.add(element);
    }

    document.querySelector("#li_tab").innerHTML = '';
    document.querySelector("#li_tab").append(...elements);
}

async function deleteTabFromLocal(url){
    const local = (await chrome.storage.local.get('tabPreserve')).tabPreserve;

    const processedData = local.filter((item)=>item.pathname !== url);

    await chrome.storage.local.set({tabPreserve:processedData});
}

// 저장된 로컬 스토리지에서 값 가져오기
// chrome.storage.local.get()

// const elements = new Set();
// for (const tab of tabs) {
//     const element = template.content.firstElementChild.cloneNode(true);

//     const title = tab.title.split("-")[0].trim();
//     const pathname = new URL(tab.url);//.pathname.slice("/docs".length);

//     element.querySelector(".title").textContent = title;
//     element.querySelector(".pathname").textContent = pathname;
//     element.querySelector("a").addEventListener("click", async () => {
//         // need to focus window as well as the active tab
//         await chrome.tabs.update(tab.id, { active: true });
//         await chrome.windows.update(tab.windowId, { focused: true });
//     });

//     elements.add(element);
//     // elements.add(tab.url);
// }
// document.querySelector("ul").append(...elements);



// const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//   const tabIds = tabs.map(({ id }) => id);
//   if (tabIds.length) {
//     const group = await chrome.tabs.group({ tabIds });
//     await chrome.tabGroups.update(group, { title: "DOCS" });
//   }
// });