// ===============================
// P2P SHOP
// script.js
// ===============================


// สินค้า
let products = [];


// ตะกร้า
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Element
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const search = document.getElementById("search");


// ===============================
// โหลดสินค้า JSON
// ===============================

fetch("products.json")
.then(response => response.json())
.then(data => {

    products = data;

    showProducts(products);

})
.catch(error => {

    console.error("โหลดสินค้าไม่สำเร็จ", error);

});



// ===============================
// แสดงสินค้า
// ===============================

function showProducts(list){

    productList.innerHTML = "";

    list.forEach(product=>{


        productList.innerHTML += `

        <div class="card">

            <img src="${product.image}">


            <div class="info">

                <h3>
                    ${product.name}
                </h3>


                <div class="price">
                    ${product.price} บาท
                </div>


                <button onclick="addToCart(${product.id})">
                    เพิ่มลงตะกร้า
                </button>


            </div>


        </div>

        `;


    });


}



// ===============================
// เพิ่มสินค้า
// ===============================

function addToCart(id){


    const product = products.find(
        p=>p.id===id
    );


    const exist = cart.find(
        item=>item.id===id
    );


    if(exist){

        exist.qty++;

    }else{


        cart.push({

            ...product,

            qty:1

        });


    }


    saveCart();

    renderCart();


}



// ===============================
// บันทึกตะกร้า
// ===============================

function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}



// ===============================
// แสดงตะกร้า
// ===============================

function renderCart(){


    cartItems.innerHTML="";


    let subtotal = 0;

    let count = 0;



    if(cart.length===0){

        cartItems.innerHTML =
        "<p>ยังไม่มีสินค้า</p>";

    }



    cart.forEach(item=>{


        subtotal += item.price * item.qty;

        count += item.qty;



        cartItems.innerHTML += `


        <div style="
        border:1px solid #ddd;
        padding:10px;
        border-radius:10px;
        margin-bottom:10px;
        ">


        <b>${item.name}</b>


        <br>

        ${item.price} บาท


        <br><br>


        <button onclick="decrease(${item.id})">
        ➖
        </button>


        <b style="margin:0 10px">
        ${item.qty}
        </b>


        <button onclick="increase(${item.id})">
        ➕
        </button>



        <br><br>


        <button 
        onclick="removeItem(${item.id})"
        style="
        background:red;
        color:white;
        border:none;
        padding:5px 10px;
        border-radius:5px;
        "
        >
        ลบ
        </button>


        </div>


        `;


    });



    let shipping = cart.length > 0 ? 50 : 0;


    let total = subtotal + shipping;



    totalPrice.innerHTML = `

    ค่าสินค้า : ${subtotal} บาท

    <br>

    ค่าส่ง : ${shipping} บาท

    <hr>

    <b>
    รวมทั้งหมด : ${total} บาท
    </b>

    `;



    cartCount.innerText = count;



}



// ===============================
// เพิ่มจำนวน
// ===============================

function increase(id){


    const item = cart.find(
        i=>i.id===id
    );


    if(item){

        item.qty++;

    }


    saveCart();

    renderCart();


}



// ===============================
// ลดจำนวน
// ===============================

function decrease(id){


    const item = cart.find(
        i=>i.id===id
    );


    if(!item)return;



    item.qty--;



    if(item.qty<=0){

        cart =
        cart.filter(
            i=>i.id!==id
        );

    }



    saveCart();

    renderCart();



}



// ===============================
// ลบสินค้า
// ===============================

function removeItem(id){


    cart =
    cart.filter(
        item=>item.id!==id
    );


    saveCart();

    renderCart();


}



// ===============================
// ค้นหา
// ===============================

search.addEventListener(
"keyup",
()=>{


    let keyword =
    search.value.toLowerCase();



    let result =
    products.filter(product=>

        product.name
        .toLowerCase()
        .includes(keyword)

    );



    showProducts(result);



});



// ===============================
// ส่ง LINE
// ===============================

document
.getElementById("lineButton")
.addEventListener(
"click",
()=>{


if(cart.length===0){

    alert("กรุณาเลือกสินค้า");

    return;

}



let name =
document.getElementById("customerName")
.value.trim();



let phone =
document.getElementById("customerPhone")
.value.trim();



let address =
document.getElementById("customerAddress")
.value.trim();



if(!name || !phone || !address){

    alert("กรอกข้อมูลให้ครบ");

    return;

}



let message =
"🛒 P2P SHOP\n\n";



let subtotal = 0;



cart.forEach(item=>{


let price =
item.price * item.qty;


subtotal += price;


message +=
`${item.name} x${item.qty} = ${price} บาท\n`;


});



let shipping = 50;


let total =
subtotal + shipping;



message +=
`\nค่าสินค้า : ${subtotal} บาท`;

message +=
`\nค่าส่ง : ${shipping} บาท`;

message +=
`\nรวมทั้งหมด : ${total} บาท\n\n`;



message +=
`ชื่อ : ${name}\n`;

message +=
`เบอร์ : ${phone}\n`;

message +=
`ที่อยู่ : ${address}`;


let lineURL =
"https://line.me/R/oaMessage/@407icsbr/?"
+
encodeURIComponent(message);

window.location.href = lineURL;


cart = [];

saveCart();

renderCart();



});



// โหลดตะกร้าเดิม
renderCart();
const cartIcon = document.getElementById("cartIcon");
const cartBox = document.getElementById("cartBox");


cartIcon.addEventListener("click",()=>{

    if(cartBox.style.display === "block"){
        cartBox.style.display = "none";
    }
    else{
        cartBox.style.display = "block";
    }

});
