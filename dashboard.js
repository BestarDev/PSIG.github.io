const noIncidentDiv = document.getElementById('incidentNo');
const existIncidentDiv = document.getElementById('incidentExist');
const incidentList = document.getElementById('incidentList');

document.addEventListener('DOMContentLoaded', function () {
    const request = indexedDB.open('psigDatabase');
    const dataKeys = ["investigationsNo", "title", "notes", "createdDate"];

    request.onsuccess = function(event) {
        existIncidentDiv.classList.remove('d-none');
        noIncidentDiv.classList.add('d-none');
        const db = event.target.result;
        const objectStoreNames = db.objectStoreNames;

        if(objectStoreNames.length !== 0){
            for(let i = 0; i < objectStoreNames.length; i++){
                const storeName = objectStoreNames[i];
                var transaction = db.transaction(storeName, 'readonly');
                var objectStore = transaction.objectStore(storeName);

                const trelem = document.createElement('tr');
                for(let j = 0; j < dataKeys.length; j++){
                    const getDataRequest = objectStore.get(dataKeys[j]);

                    getDataRequest.onsuccess = (event) => {
                        const res = event.target.result;
                        console.log(res);
                        
                        const tdelem = document.createElement('td');
                        if(res.key !== "createdDate")
                            tdelem.innerText = res.value;
                        else {
                            const createdDate = res.value;
                            tdelem.innerText = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString();
                        }
                        trelem.appendChild(tdelem);
                    }
                }
                incidentList.appendChild(trelem);
            }
        } else {
            existIncidentDiv.classList.add('d-none');
            noIncidentDiv.classList.remove('d-none');
        }
    };

    request.onerror = function(event) {
        console.error('Error opening database:', event.target.error);
    };
});