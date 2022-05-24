var categoryField = document.getElementById("category")
var serviceField = document.getElementById("service")
var qtyField = document.getElementById("qtyField")
var desc = document.getElementById("desc")
var usd = document.getElementById("USDamt")
var inr = document.getElementById("INRamt")
var helper = document.getElementById("helper")
var platform = document.getElementById("platform")
var progress = document.querySelector(".is-loading")
var value = ""
var price
var key = "$2y$10$FpJoi7RK1KMQ86MAm08N4OD/2EbJtSAQZo2d8ukGV2K5DvVA5XusO"
var requestOptions = {
    method: 'POST',
    redirect: 'follow'
}
var url = `https://msp-panel.com/api/v2?key=${key}&action=services`;

async function getServicesAPI() {
    try{
    var platformCategories = []
    const response = await fetch(url,requestOptions)
    const data = await response.json()
    const services = await data
    var platformServices = await services.filter(el => (el["category"].includes(platform.innerText)))
    platformServices.filter(el => platformCategories.push(el["category"]))
    platformCategories = Array.from(new Set(platformCategories))
    var categoryOptions = "<option value='null'>Select a Category</option>"
    platformCategories.forEach(el => {
        categoryOptions += `<option value="${el}">${el}</option>`
    });
    categoryField.innerHTML = categoryOptions
    progress.classList.remove("is-loading")
    return await platformServices
}catch(err) {
    console.log(err)
}
}

getServicesAPI().then(res => {findServiceByCategory(res)})

function findServiceByCategory(arr) {
    categoryField.addEventListener("change", ()=>{
        servicesForCat = []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]["category"] === categoryField.value) {
                servicesForCat.push(arr[i])
           }
        }
        var serviceOptions = "<option value='null'>Select a Service</option>"
        servicesForCat.forEach(function(slide) {
        serviceOptions += `<option value="${slide.service}">`+ slide.name + '</option>';
        }); 
        serviceField.innerHTML = serviceOptions;
        serviceField.addEventListener("change", (e)=>{
            var selectedService = [];
            arr.forEach(el => {
                if (el.service == serviceField.value){
                    selectedService.push(el)
                }
            })
            if(selectedService[0].name.includes("CUSTOM") ||  selectedService[0].name.includes("Custom") ||  selectedService[0].name.includes("custom")){
                var commentField = `<input class="input" name="comment" id="qtyField" onkeypress="priceAccQty(this.value)" onchange="priceAccQty(this.value)" placeholder="Comment Separated on Each Line">`
                document.getElementById("commentLabel").innerText = "Custom Comments"
                document.getElementById("qtycom").innerHTML = commentField
            }
            if(selectedService[0].min === selectedService[0].max){
                helper.innerHTML = "Enter Quantity 1000"
                qtyField.max = 1000
                qtyField.min = 1000
            }else{
                qtyField.max = selectedService[0].max
                qtyField.min = selectedService[0].min
                helper.innerHTML = `Enter Quantity From ${selectedService[0].min} to  ${selectedService[0].max}`
            }
            desc.innerText = selectedService[0].desc
            price = (selectedService[0].rate * 40/100) + Number(selectedService[0].rate)
        })
    })
}

async function priceAccQty(value, callback){
    try{
    var calc
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/usd`)
    const data = await response.json()
    const rate = await data.rates["INR"]

    if(!document.getElementById("qtyField").value){
        inr.innerText = price.toFixed(2) + " INR"
        usd.innerText = (price / rate).toFixed(2) + " USD"
    } else {
        calc = (document.getElementById("qtyField").value * price/1000)
        inr.innerText =  calc.toFixed(2) + " INR"
        usd.innerText = (calc / rate).toFixed(2) + " USD"
    }} catch (err) {
        console.log(err)
    }
}
 
this.addEventListener('scroll', function() {
    if(this.pageYOffset > 70){
        document.querySelector(".sidebar").style.top = "0px"        
    } else if (this.pageYOffset < 70) {
        document.querySelector(".sidebar").removeAttribute("style")
    }
  });

if(this.outerWidth < 500){
    document.getElementById("check").checked = true
}

desc.remove()