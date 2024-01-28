incidentbarHidden = true;

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

const readData = (pageName) => {
    const request = indexedDB.open('psigDatabase', 1);

    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction([pageName], 'readonly');
        var objectStore = transaction.objectStore(pageName);
        values=[];

        var cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                // Collect the value of the current record
                values.push(cursor.value);
                const curValue = cursor.value;
                const updateDiv = document.getElementById(curValue.key);
                updateDiv.value = curValue.value;
                cursor.continue();
            }
        };
    };
}

document.addEventListener('DOMContentLoaded', () => {
    readData('details');
})

const saveData = () => {
    const parentDiv = document.getElementById("incidentMainContent");

    const formSelects = Array.from(parentDiv.getElementsByClassName('form-select'));
    const formInputs = Array.from(parentDiv.getElementsByClassName('form-control'));

    const formData = [];

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

    console.log(formData);

    const request = indexedDB.open('psigDatabase', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore(pageName, { keyPath: 'key' });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        
        // Start a new transaction to access the object store
        const transaction = db.transaction([pageName], 'readwrite');
        const objectStore = transaction.objectStore(pageName);

        const addData = function(obj) {
            const transaction = db.transaction([pageName], 'readwrite');
            const objectStore = transaction.objectStore(pageName);
            const request = objectStore.add(obj);
        
            request.onsuccess = function(event) {
              console.log('Data added successfully');
            };
        };
        
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

        formData.forEach((formDatum) => {
            const key = formDatum.key;
            const value = formDatum.value;

            addData(formDatum);
        })

        db.close();
    }
}

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