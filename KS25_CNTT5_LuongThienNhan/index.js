
let employees = JSON.parse(localStorage.getItem("employees")) || [
    { id: "NV1", name: "Nguyễn Văn An", dob: "1990-05-12", email: "an.nguyen@company.vn", address: "Hà Nội" },
    { id: "NV2", name: "Trần Thị Bích", dob: "1995-08-23", email: "bich.tran@company.vn", address: "TP. HCM" },
    { id: "NV3", name: "Lê Minh Cường", dob: "1988-11-03", email: "cuong.le@company.vn", address: "Đà Nẵng" },
    { id: "NV4", name: "Phạm Thị Dung", dob: "1993-02-17", email: "dung.pham@company.vn", address: "Vũng Tàu" },
    { id: "NV5", name: "Hoàng Văn Em", dob: "1997-07-09", email: "em.hoang@company.vn", address: "TP. HCM" }
];
let editId = null;
let currentPage = 1;
let limit = 5;
function render() {
    const tableBody = document.getElementById("tableBody");
    const searching = document.getElementById("searchInput").value.toLowerCase();
    let filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searching) || 
        emp.email.toLowerCase().includes(searching)
    );
    let total = filtered.length;
    let totalPages = Math.ceil(total / limit) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    let start = (currentPage - 1) * limit;
    let end = start + limit;
    let dataPage = filtered.slice(start, end);
    tableBody.innerHTML = "";
    if (dataPage.length === 0) {
        document.getElementById("emptyState").style.display = "block";
    } else {
        document.getElementById("emptyState").style.display = "none";
        dataPage.forEach((emp, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${emp.name}</td>
                    <td>${emp.dob}</td>
                    <td>${emp.email}</td>
                    <td>${emp.address}</td>
                    <td>
                        <button onclick="editEmployee('${emp.id}')">Sửa</button>
                        <button onclick="deleteEmployee('${emp.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    document.getElementById("totalBadge").innerText = employees.length + " nhân viên";
    renderPagination(totalPages);
}
document.getElementById("btnSubmit").onclick = function() {
    let name = document.getElementById("inputName").value;
    let dob = document.getElementById("inputDob").value;
    let email = document.getElementById("inputEmail").value;
    let address = document.getElementById("inputAddress").value;
    if (!name || !dob || !email) return alert("Vui lòng nhập đủ thông tin!");
    let emailDuplicate = employees.find(e => e.email === email && e.id !== editId);
    if (emailDuplicate) return alert("Email đã tồn tại!");
    if (editId) {
        let index = employees.findIndex(e => e.id === editId);
        employees[index] = { id: editId, name, dob, email, address };
        editId = null;
        alert("Cập nhật thành công!");
    } else {
        let newEmp = {
            id: "NV" + Date.now(),
            name, dob, email, address
        };
        employees.push(newEmp);
        alert("Thêm thành công!");
        currentPage = 1;
    }
    localStorage.setItem("employees", JSON.stringify(employees));
    resetForm();
    render();
};
window.deleteEmployee = function(id) {
    let emp = employees.find(e => e.id === id);
    if (confirm("Xóa nhân viên " + emp.name + "?")) {
        employees = employees.filter(e => e.id !== id);
        localStorage.setItem("employees", JSON.stringify(employees));
        render();
    }
};
window.editEmployee = function(id) {
    let emp = employees.find(e => e.id === id);
    editId = id;
    document.getElementById("inputName").value = emp.name;
    document.getElementById("inputDob").value = emp.dob;
    document.getElementById("inputEmail").value = emp.email;
    document.getElementById("inputAddress").value = emp.address;
    document.getElementById("formTitle").innerText = "Cập nhật nhân viên";
    document.getElementById("btnSubmit").innerText = "Lưu thay đổi";
};
document.getElementById("searchInput").oninput = function() {
    currentPage = 1;
    render();
};
function renderPagination(totalPages) {
    let div = document.getElementById("pagination");
    div.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        div.innerHTML += `<button onclick="changePage(${i})" ${i===currentPage?'style="background:teal;color:white"':''}>${i}</button>`;
    }
}
window.changePage = function(page) {
    currentPage = page;
    render();
};
function resetForm() {
    document.getElementById("inputName").value = "";
    document.getElementById("inputDob").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputAddress").value = "";
    document.getElementById("formTitle").innerText = "Thêm nhân viên mới";
    document.getElementById("btnSubmit").innerText = "Thêm nhân viên";
}
render();