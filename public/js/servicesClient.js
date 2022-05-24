document.querySelectorAll("#sts").forEach(el => {
    if (el.innerText == "PENDING"){
      el.classList.add("tag", "is-warning", "is-large")
    }     
    else if (el.innerText == "CANCELLED" || "REFUNDED"){
      el.classList.add("tag", "is-danger", "is-large")
    }
    else if (el.innerText == "COMPLETED"){
      el.classList.add("tag", "is-success", "is-large")
    } else {
      el.classList.add("tag", "is-primary", "is-large")
    }
  })
  
document.querySelectorAll("#charge").forEach(el => {
    var amt = Number(el.innerText)
    console.log(amt)
    var price = (amt * 40/100 + amt).toFixed(2)
    el.innerText = price
})