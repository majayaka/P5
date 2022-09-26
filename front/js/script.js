fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => addProducts(data))

    function addProducts(products) {
        const imageUrl = products[0].imageUrl
        
        const anchor = document.createElement("a")
        anchor.href = imageUrl
        anchor.text = "Kanap Sinopé"
        const items = document.querySelector("#items")
        items.appendChild(anchor)
    }


