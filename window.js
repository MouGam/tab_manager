getWindowDataFromLocal();

document.getElementById("add_window_button").addEventListener("click", async()=>{
    add_current_window();
});


// 로컬 데이터에 저장되어 있는 윈도우의 리스트들을 가져와서 보여준다.
async function getWindowDataFromLocal(){
    try{
        const local = (await chrome.storage.local.get()).windowPreserve;
        // console.log(local);
        const template = document.getElementById("li_window_template");

        const elements = new Set();
        for (const window of local) {
            const element = template.content.firstElementChild.cloneNode(true);

            element.querySelector(".title").textContent = window.windowTitle;
            element.querySelector(".description").textContent = window.windowDesc;

            // 저장한 윈도우를 클릭하면 새로운 윈도우를 열어서 거기에 뜨게 한다.
            element.querySelector("a").addEventListener("click", async () => {
                // window.datas.forEach( async (e,index) => {

                //     chrome.tabs.create({url:e.pathname});
                // });
                const urls = window.datas.map((e)=>e.pathname);
                // console.log(urls);
                chrome.windows.create({url:urls});
            });
            
            element.querySelector(".delete_window").id = window.uploadTime;
            element.querySelector(".delete_window").addEventListener("click", async(event)=>{
                await deleteWindowFromLocal(event.target.id);
                await getWindowDataFromLocal();
            });

            elements.add(element);
        }

        document.querySelector("#li_window").innerHTML = '';
        document.querySelector("#li_window").append(...elements);
    }catch(err){
        console.error(err);
        console.log('저장된 윈도우 없음');
    }
}

// 현재 윈도우의 정보를 로컬에 저장한다.

// 실제로 로컬에 저장하는것은 updateWindowDataToLocal함수가 진행한다.
// add_current_window함수는 현재 윈도우의 정보를 updateWindowDataToLocal함수에 전해준다.
async function add_current_window(){
    // 현재윈도우 내의 탭들의 정보
    const current_window_info = await chrome.tabs.query({currentWindow:true});

    let dataForAdd = current_window_info.map((e)=>{
        return {
            title: e.title,
            pathname: e.url
        };
    })

    //윈도우 이름과 설명
    let windowTitle = document.querySelector('#current_window_title').value;
    let windowDesc = document.querySelector('#current_window_description').value;

    //만약 입력 안하면 첫번째 탭의 이름과 url로
    if(windowTitle === ""){
        windowTitle = dataForAdd[0].title;
    }
    if(windowDesc === ""){
        dataForAdd.forEach((e, idx) => {
            if(idx === 0)
            windowDesc = e.title;
            else
                windowDesc = `${windowDesc}, ${e.title}`;
        });
    }

    await updateWindowDataToLocal({
        windowTitle:windowTitle,
        windowDesc:windowDesc,
        datas:dataForAdd,
        uploadTime:Date.now()
    });

    await getWindowDataFromLocal();
}

// 실제로 로컬에 저장하는 함수.
// add_current_window함수에서 이 함수에 데이터를 넘겨준다.
async function updateWindowDataToLocal(updateData){
    const local = (await chrome.storage.local.get('windowPreserve')).windowPreserve;
    try{
        await chrome.storage.local.set({windowPreserve:[...local, updateData]});
    }catch(err){
        await chrome.storage.local.set({windowPreserve:[updateData]});
    }
}

// 로컬 저장소에서 delId와 일치하는 윈도우를 삭제한다.
async function deleteWindowFromLocal(delId){
    const local = (await chrome.storage.local.get()).windowPreserve;
 
    const processedData = local.filter((item)=> Number(item.uploadTime) !== Number(delId));

    await chrome.storage.local.set({windowPreserve:processedData});
}