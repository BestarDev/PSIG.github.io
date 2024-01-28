incidentbarHidden = true;
indexedDBVersion = 1;

// Incident bar action
const toggleIncidentBar = () => {
    const maindiv = document.getElementById('main')
    const incidentbar= document.getElementById('incidentbar');
    const togglebtn = document.getElementById('incidentbarToggleBtn');
    const toggleBtnDiv = document.getElementById('incidentbarBtnDiv');

    incidentbarHidden = !incidentbarHidden;
    if(incidentbarHidden) {
        maindiv.classList.remove('main-with-incidentbar')
        incidentbar.classList.remove('show')
        togglebtn.classList.remove('fa-circle-xmark');
        togglebtn.classList.add('fa-note-sticky');
        toggleBtnDiv.style.right=0;
    } else {
        maindiv.classList.add('main-with-incidentbar')
        incidentbar.classList.add('show')
        togglebtn.classList.remove('fa-note-sticky');
        togglebtn.classList.add('fa-circle-xmark');
        toggleBtnDiv.style.right='var(--incidentbar-width)'
    }
}

/* Tabs Event Handler */
const setActiveTab = (evt, tabidx) => {
    tabcontent = document.getElementsByClassName("tab-content");
    tablinks = document.getElementsByClassName('nav-link');

    
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace('show', 'hide')
    }
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    tabcontent[tabidx-1].className = tabcontent[tabidx-1].className.replace('hide', 'show');
    evt.currentTarget.className += " active";
}

const getIncidentNo = () => {
    const request = indexedDB.open('psigDatabase');

    request.onsuccess = function(event) {
        const db = event.target.result;
        const noDiv = document.getElementById('incidentNo');
        noDiv.innerHTML = db.version.toString();
    }
}

// const readData = (pageName) => {
//     const request = indexedDB.open('psigDatabase');

//     request.onsuccess = function(event) {
//         var db = event.target.result;
//         var objectStoreNames = db.objectStoreNames;

//         var transaction = db.transaction([pageName], 'readwrite');
//         console.log("transaction", transaction);
//         var objectStore = transaction.objectStore(pageName);
//         values=[];

//         var cursorRequest = objectStore.openCursor();

//         cursorRequest.onsuccess = function(event) {
//             var cursor = event.target.result;
//             if (cursor) {
//                 // Collect the value of the current record
//                 values.push(cursor.value);
//                 const curValue = cursor.value;
//                 const updateDiv = document.getElementById(curValue.key);
//                 updateDiv.value = curValue.value;
//                 cursor.continue();
//             }
//         };
//     };
// }

document.addEventListener('DOMContentLoaded', () => {
    getIncidentNo();
})

const saveData = (type) => {
    const parentDiv = document.getElementById("incidentMainContent");

    const formSelects = Array.from(parentDiv.getElementsByClassName('form-select'));
    const formInputs = Array.from(parentDiv.getElementsByClassName('form-control'));

    const createdDate = new Date();

    const formData = [{'key':'createdDate', 'value':createdDate}];

    formSelects.forEach((formSelect) => {
        data = {};
        data['key'] = formSelect.id;
        data['value']=formSelect.value;
        formData.push(data);
    });

    formInputs.forEach((formInput) => {
        data = {};
        data["key"] = formInput.id;
        data["value"]=formInput.value;
        formData.push(data);
    });

    const noDiv = document.getElementById('incidentNo');
    const tablename = parseInt(noDiv.textContent);
    const databaseVer = tablename + 1;

    const request = indexedDB.open('psigDatabase', databaseVer);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore(tablename.toString(), { keyPath: 'key' });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        const addData = function(obj) {
            const transaction = db.transaction(tablename.toString(), 'readwrite');
            const objectStore = transaction.objectStore(tablename.toString());
            const request = objectStore.add(obj);
        };

        const updateData = function(obj) {
            const transaction = db.transaction(tablename.toString(), 'readwrite');
            const objectStore = transaction.objectStore(tablename.toString());
            const getRequest = objectStore.get(obj.key);
            getRequest.onsuccess = (event) => {
                data = event.target.result;
                data.updatedProperty = obj.value;
                objectStore.put(data);
            }
        }

        const deleteData = function() {
            const transaction = db.transaction(tablename.toString(), 'readwrite');
            const objectStore = transaction.objectStore(tablename.toString());
            var deleteRequest = objectStore.openCursor();

            deleteRequest.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    objectStore.delete(cursor.primaryKey);
                    cursor.continue();
                } else {
                    console.log('All data in the object store has been deleted');
                }
            };
        }

        if(!db.objectStoreNames.contains(tablename.toString())) {
            formData.forEach((formDatum) => {
                const key = formDatum.key;
                const value = formDatum.value;

                addData(formDatum);
            })
        } else {
            deleteData();
            formData.forEach((formDatum) => {
                const key = formDatum.key;
                const value = formDatum.value;

                addData(formDatum);
            })
        }

        if(type == "refresh")
            setTimeout(() => {window.location.href = "./dashboard.html";}, 2000);
        else
            setTimeout(() => {window.location.reload();}, 1000);
        db.close();
    }
}