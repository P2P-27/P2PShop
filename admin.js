async function saveToGithub(products){


const url =
`https://api.github.com/repos/${GITHUB.username}/${GITHUB.repo}/contents/${GITHUB.file}`;



// อ่านไฟล์เดิม

let response = await fetch(url,{
headers:{
Authorization:`Bearer ${GITHUB.token}`
}
});


let file = await response.json();



// แปลงข้อมูลเป็น Base64

let content =
btoa(
unescape(
encodeURIComponent(
JSON.stringify(products,null,2)
)
)
);



// ส่งกลับ GitHub

let update = await fetch(url,{

method:"PUT",

headers:{

Authorization:`Bearer ${GITHUB.token}`,

"Content-Type":"application/json"

},

body:JSON.stringify({

message:"Update products",

content:content,

sha:file.sha

})

});



if(update.ok){

alert("อัปเดตสินค้าใน GitHub แล้ว");

}else{

alert("อัปเดตไม่สำเร็จ");

}


}
