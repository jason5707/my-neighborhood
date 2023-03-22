

let reports
let url = '/reportsApi'


fetch(url)
    .then(response => response.json())
    .then(data => reports = data)
    .then(showCat => showReports())
    .then(centerMap => center())

let photos
let photosurl = '/photosApi'

fetch(photosurl)
    .then(response => response.json())
    .then(data => photos = [...data])


function findAddresses() {
    console.log(reportAddress.value)
    let url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + reportAddress.value
    console.log(url)
    fetch(url)
        .then(response => response.json())
        .then(data => addressArr = data)
        .then(showAddress => showAddresses())
        .catch(err => console.log(err))
}

let mymap = L.map('mapid').setView([28.0683496, -80.5603303], 14)
let marker

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

function showReports() {
    reports.forEach(report => {
        let pictureArr = []
        if (photos) {
            pictureArr = photos.filter(picObj => {
                return picObj.report === report.id
            })
        }
        let imgUrl = ""
        let content
        if (pictureArr.length > 0) {
            imgUrl = pictureArr[0].url
            content = '<img src=' + imgUrl + ' style="width: 100px">'
        } else {
            content = '<a href=/reports/' + report.id + '>DETAILS HERE--></a>'
        }

        let pop = L.popup({
            closeOnClick: true
        }).setContent(content)
        let coords = [report.coordX, report.coordY]
        let marker = L.marker(coords).addTo(mymap).bindPopup(pop)

        tooltip = L.tooltip({
            permanent: true
        }).setContent('<p>' + report.title + '</p>')
        marker.bindTooltip(tooltip)
    })
}

let list = document.querySelectorAll('.card')

function center() {
    reports.forEach((cat, idx) => {
        console.log("script is running")
        list[idx].addEventListener("mouseover", (event) => {
            mymap.flyTo([cat.coordX, cat.coordY], 14)
        })
    })
}