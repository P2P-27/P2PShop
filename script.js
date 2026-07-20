// ===============================
// P2P SHOP
// script.js (Part 1)
// ===============================

// ---------- สินค้าตัวอย่าง ----------
let products = [];

// ---------- โหลดตะกร้า ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- Element ----------
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const search = document.getElementById("search");

// ===========================
// แสดงสินค้า
// ===========================
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    showProducts(products);
  })
  .catch(error => {
    console.error("โหลดสินค้าไม่สำเร็จ", error);
  });
function showProducts(list){

    productList.innerHTML = "";

    list.forEach(product=>{

        productList.innerHTML += `

        <div class="card">

            <img src="${product.image}" alt="">

            <div class="info">

                <h3>${product.name}</h3>

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

// ===========================
// เพิ่มสินค้า
// ===========================

function addToCart(id){

    const product = products.find(p=>p.id===id);

    const exist = cart.find(i=>i.id===id);

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

// ===========================
// บันทึก LocalStorage
// ===========================

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

}

// ===========================
// แสดงตะกร้า
// ===========================

function renderCart(){

    cartItems.innerHTML="";

    let total=0;

    let count=0;

    cart.forEach(item=>{

        total += item.price * item.qty;

        count += item.qty;

        cartItems.innerHTML += `

        <div style="margin-bottom:15px;">

            <b>${item.name}</b>

            <br>

            ราคา ${item.price} บาท

            <br>

            จำนวน ${item.qty}

        </div>

        <hr>

        `;

    });

    totalPrice.innerText=total;

    cartCount.innerText=count;

}

// ===========================
// ค้นหาสินค้า
// ===========================

search.addEventListener("keyup",()=>{

    const keyword = search.value.toLowerCase();

    const filter = products.filter(product=>

        product.name.toLowerCase().includes(keyword)

    );

    showProducts(filter);

});

// ===========================
// โหลดครั้งแรก
// ===========================

showProducts(products);

renderCart();
// ===============================
// P2P SHOP
// script.js (Part 2)
// ===============================

// เพิ่มจำนวน
function increase(id){

    const item = cart.find(i=>i.id===id);

    if(item){

        item.qty++;

    }

    saveCart();

    renderCart();

}

// ลดจำนวน
function decrease(id){

    const item = cart.find(i=>i.id===id);

    if(!item) return;

    item.qty--;

    if(item.qty<=0){

        cart = cart.filter(i=>i.id!==id);

    }

    saveCart();

    renderCart();

}

// ลบสินค้า
function removeItem(id){

    cart = cart.filter(item=>item.id!==id);

    saveCart();

    renderCart();

}

// ===========================
// แสดงตะกร้าใหม่
// ===========================

renderCart = function(){

    cartItems.innerHTML="";

    let total=0;
    let count=0;

    if(cart.length===0){

        cartItems.innerHTML="<p>ยังไม่มีสินค้า</p>";

    }

    cart.forEach(item=>{

        total += item.price*item.qty;
        count += item.qty;

        cartItems.innerHTML += `

        <div style="
        border:1px solid #ddd;
        border-radius:10px;
        padding:10px;
        margin-bottom:10px;
        ">

            <b>${item.name}</b>

            <br>

            ${item.price} บาท

            <br><br>

            <button onclick="decrease(${item.id})">➖</button>

            <b style="margin:0 10px;">
                ${item.qty}
            </b>

            <button onclick="increase(${item.id})">➕</button>

            <br><br>

            <button
            onclick="removeItem(${item.id})"
            style="
            background:red;
            color:white;
            border:none;
            padding:6px 10px;
            border-radius:6px;
            cursor:pointer;
            ">
            ลบ
            </button>

        </div>

        `;

    });

    totalPrice.innerText=total;
    cartCount.innerText=count;

}

// ===========================
// ส่ง LINE
// ===========================

document.getElementById("lineButton").addEventListener("click",()=>{

    if(cart.length===0){

        alert("กรุณาเลือกสินค้า");

        return;

    }

    const name=document.getElementById("customerName").value.trim();

    const phone=document.getElementById("customerPhone").value.trim();

    const address=document.getElementById("customerAddress").value.trim();

    if(name==="" || phone==="" || address===""){

        alert("กรอกข้อมูลให้ครบ");

        return;

    }

    let message="🛒 P2P SHOP\n\n";

    cart.forEach(item=>{

        message+=`${item.name} x${item.qty} = ${item.price*item.qty} บาท\n`;

    });

    const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);

    message += "\n";
    message += "รวมทั้งหมด : "+total+" บาท\n\n";

    message += "ชื่อ : "+name+"\n";
    message += "เบอร์ : "+phone+"\n";
    message += "ที่อยู่ : "+address;

    const url="https://line.me/R/msg/text/?"+encodeURIComponent(message);

    window.open(url);

    cart=[];

    saveCart();

    renderCart();

});

// โหลดตะกร้าอีกครั้ง
renderCart();
