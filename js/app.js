const cafeList = document.querySelector("#cafe-list"),
    form = document.querySelector('#add-cafe-form');

// create element and render cafe
function renderCafe(doc){
    let li = document.createElement("li"),
        name = document.createElement('span'),
        city = document.createElement('span'),
        cross = document.createElement('div')
    ;

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // delete date
    cross.addEventListener('click', function(e){
        e.preventDefault();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}

// getting data
// db.collection('cafes') .get().then((snapshot)=>{
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     });
// });

// real time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot=>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderCafe(change.doc);
        } else if( change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id +']');
            cafeList.removeChild(li)
        }
    });
})

// save form data
form.addEventListener('submit', function (e) {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

// order and search
// where('city', '==', 'Marioland').orderBy('name')