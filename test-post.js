const data = {"id":"","scope":"chung","category":"Chung","categoryDesc":"","fullName":"Nguyễn Văn BE","role":"Bí thư chi đoàn THôn 5","phone":"0965305720","address":"Hà Nội","avatarUrl":"/uploads/1775630293010-942911554-cropped.jpg","displayType":"normal","villageId":"cmnpjs5cj0000jkk5jk5ie0ex"};

fetch('http://localhost:3000/api/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data)))
.catch(err => console.error(err));
