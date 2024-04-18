var danhSachSinhVien = new DanhSachSinhVien();

function GetDanhSachSinhVien() {
    fetch('http://localhost:3000/api/students') 
    .then(response => response.json())
    .then(data => {
        console.log(data);
        danhSachSinhVien = new DanhSachSinhVien(); 
        if (data && Array.isArray(data)) { 
            console.log(data);
            danhSachSinhVien.DSSV = data;
            console.log(danhSachSinhVien.DSSV);

            CapNhatDanhSachSV(danhSachSinhVien.DSSV);
        } else {
            console.log("Danh sách sinh viên từ API rỗng hoặc không hợp lệ.");
            danhSachSinhVien.DSSV = [];
        }
        console.log(danhSachSinhVien);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

GetDanhSachSinhVien();

// GetStorage();

var validate = new Validation();

//Bổ sung thuộc tính 
SinhVien.prototype.DiemToan = '';
SinhVien.prototype.DiemLy ='';
SinhVien.prototype.DiemHoa ='';
SinhVien.prototype.DTB ='';
SinhVien.prototype.Loai ='';
//Thêm phương thức
SinhVien.prototype.TinhDTB = function (){
    this.DTB = (Number(this.DiemHoa) + Number(this.DiemLy) + Number(this.DiemHoa)) / 3;
}
SinhVien.prototype.XepLoai = function(){
    if(this.DTB<=10 && this.DTB >=8)
    {
        this.Loai = "Xếp loại Giỏi";
    }
    else if (this.DTB<8 && this.DTB >= 6.5)
    {
        this.Loai = "Xếp loại Khá";
    } 
    else if (this.DTB<6.5 && this.DTB >= 5)
    {
        this.Loai = "Xếp loại Trung Bình";
    }
    else
    {
        this.Loai = "Xếp loại yếu";
    }
}


function DomID(id)
{
    var element = document.getElementById(id);
    return element;
}

function ThemSinhVien()
{
    //Lấy dữ liệu từ người dùng nhập vào
    var masv = DomID("masv").value;
    var hoten = DomID("hoten").value;
    var cmnd = DomID("cmnd").value;
    var email = DomID("email").value;
    var sdt = DomID("sdt").value;
    var loi = 0;
    //Kiểm tra validation
    if(KiemTraDauVaoRong("masv",masv) == true)
    {
        loi++;
    }
    if(KiemTraDauVaoRong("hoten",hoten) == true)
    {
        loi++;
    }
    if(KiemTraDauVaoRong("cmnd",cmnd) == true)
    {
        loi++;
    }   
    if(validate.KiemTraEmail(email))
    {
        document.getElementById("email").style.borderColor = "green";
    }
    else
    {
        document.getElementById("email").style.borderColor = "red";
        loi++;
    }
    if(validate.KiemTraSoDT(sdt))
    {
        document.getElementById("sdt").style.borderColor = "green";
    }
    else
    {
        document.getElementById("sdt").style.borderColor = "red";
        loi++;
    }
    if(loi != 0)
    {
        return ;
    }
    //Thêm sinh viên
    var sinhvien = new SinhVien(masv, hoten, email, sdt, cmnd);
    sinhvien.DiemToan = DomID("Toan").value;
    sinhvien.DiemLy = DomID("Ly").value;
    sinhvien.DiemHoa = DomID("Hoa").value;
    sinhvien.TinhDTB();
    sinhvien.XepLoai();
    console.log(sinhvien)
    var data = {
        maSV: sinhvien.MaSV,
        hoTen: sinhvien.HoTen,
        email: sinhvien.Email,
        xepLoai: sinhvien.Loai,
        soDienThoai: sinhvien.SoDT,
        cmnd: sinhvien.CMND,
        diemToan: Number(sinhvien.DiemToan),
        diemTB: Number(sinhvien.DTB),
        diemLy: Number(sinhvien.DiemLy),
        diemHoa: Number(sinhvien.DiemHoa)
    };

    console.log(data)

    fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add student');
        }
    })
    .then(data => {
        console.log('New student added:', data);
        var sinhvien = new SinhVien(data.masv, data.hoten, data.email, data.sdt, data.cmnd);
        danhSachSinhVien.ThemSinhVien(sinhvien);
        CapNhatDanhSachSV(danhSachSinhVien);
    })
    .catch(error => {
        console.error('Error adding student:', error);
    });
    console.log(danhSachSinhVien);
}


function KiemTraDauVaoRong(ID,value)
{
    //Kiểm tra mã sinh viên rỗng
    console.log(ID,value)
    if(validate.KiemTraRong(value) == true)
    {
        DomID(ID).style.borderColor = "red"; 
        return true;                 
    }
    else
    {
        DomID(ID).style.borderColor = "green";  
        return false;
    } 
}

function SuaSinhVien(id) {
    console.log(id)
    // Gọi API và truyền ID của sinh viên
    fetch(`http://localhost:3000/api/students/${id} `)
        .then(response => response.json())
        .then(data => {
            console.log('Student to edit:', data);
            DomID("masv").value = data.maSV;
            DomID("hoten").value = data.hoTen;
            DomID("cmnd").value = data.cmnd;
            DomID("email").value = data.email;
            DomID("sdt").value = data.soDienThoai;
            DomID("Toan").value = data.diemToan;
            DomID("Ly").value = data.diemLy;
            DomID("Hoa").value = data.diemHoa;
            DomID("idsv").value = data._id;
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
}
function XoaSinhVien2(id) {
    console.log(id)
    fetch(`http://localhost:3000/api/students/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add student');
        }
    })
    .then(data => {
        console.log('New student added:', data);
        var sinhvien = new SinhVien(data.masv, data.hoten, data.email, data.sdt, data.cmnd);
        danhSachSinhVien.ThemSinhVien(sinhvien);
        CapNhatDanhSachSV(danhSachSinhVien);
    })
    .catch(error => {
        console.error('Error adding student:', error);
    });
}


function CapNhatDanhSachSV(DanhSachSinhVien) {
    console.log(DanhSachSinhVien)
    var lstTableSV = DomID("tbodySinhVien");
    lstTableSV.innerHTML = ""; 

    for (var i = 0; i < DanhSachSinhVien.length; i++) {
        var sv = DanhSachSinhVien[i]; // Lấy thông tin sinh viên từ danh sách
        var trSinhVien = document.createElement("tr"); // Tạo một thẻ tr mới

        // Tạo các thẻ td và gán dữ liệu tương ứng từ sinh viên
        var tdMaSV = TaoTheTD("MaSV", sv.maSV);
        var tdHoTen = TaoTheTD("HoTen", sv.hoTen);
        var tdEmail = TaoTheTD("Email", sv.email);
        var tdCMND = TaoTheTD("CMND", sv.cmnd);
        var tdSoDT = TaoTheTD("SoDT", sv.soDienThoai);
        var tdDTB = TaoTheTD("DTB", sv.diemTB); // Điểm trung bình
        var tdXepLoai = TaoTheTD("XepLoai", sv.xepLoai); // Xếp loại

        var buttonSua = document.createElement("button");
        buttonSua.className = "btn btn-warning";
        buttonSua.textContent = "Sửa";
        buttonSua.dataset.studentId = sv._id; // Gán _id vào thuộc tính dataset

        var buttonXoa = document.createElement("button");
        buttonXoa.className = "btn btn-danger";
        buttonXoa.textContent = "Xóa";
        buttonXoa.dataset.studentId = sv._id;

        var tdButton = document.createElement("td");
        tdButton.appendChild(buttonSua);
        tdButton.appendChild(buttonXoa);

        buttonSua.addEventListener('click', function() {
            var studentId = this.dataset.studentId;
            SuaSinhVien(studentId); 
        });
        buttonXoa.addEventListener('click', function() {
            console.log("123123")
            var studentId = this.dataset.studentId;
            XoaSinhVien2(studentId); 
        });

        // Thêm các thẻ td vào thẻ tr
        trSinhVien.appendChild(tdMaSV);
        trSinhVien.appendChild(tdHoTen);
        trSinhVien.appendChild(tdEmail);
        trSinhVien.appendChild(tdCMND);
        trSinhVien.appendChild(tdSoDT);
        trSinhVien.appendChild(tdDTB);
        trSinhVien.appendChild(tdXepLoai);
        trSinhVien.appendChild(tdButton);

        // Thêm thẻ tr vào tbodySinhVien
        lstTableSV.appendChild(trSinhVien);
    }
}

function TaoTheTD (className, value)
{
    var td = document.createElement("td");
    td.className = className;
    td.innerHTML = value;
    return td;
}


function SetStorage()
{
    //Chuyển đổi object mảng danh sách sinh viên thành chuỗi json
    var jsonDanhSachSinhVien = JSON.stringify(danhSachSinhVien.DSSV);
    //Rồi đem chuỗi json lưu vào storage và đặt tên là DanhSachSV
    localStorage.setItem("DanhSachSV",jsonDanhSachSinhVien);
}

function GetStorage()
{
    //Lấy ra chuỗi json là mảng danhsachsinhvien thông qua tên DanhSachSV
    var jsonDanhSachSinhVien = localStorage.getItem("DanhSachSV");
    var mangDSSV = JSON.parse(jsonDanhSachSinhVien);
    danhSachSinhVien.DSSV = mangDSSV;
    CapNhatDanhSachSV(danhSachSinhVien);

}
//Xóa sinh viên
function XoaSinhVien()
{
    //Mảng checkbox
    var lstMaSV = document.getElementsByClassName("ckbMaSV");
    //Mảng mã sinh viên được chọn
    var lstMaSVDuocChon = [];
    for(i = 0 ; i<lstMaSV.length ;i++)
    {
        console.log(lstMaSV[i]);
        if(lstMaSV[i].checked) //Kiểm phần tử checkbox đó có được chọn hay chưa
        {
            lstMaSVDuocChon.push(lstMaSV[i].value);
        }
    }
    danhSachSinhVien.XoaSinhVien(lstMaSVDuocChon);
    CapNhatDanhSachSV(danhSachSinhVien);
}


function TimKiemSinhVien()
{
    var tukhoa = DomID("tukhoa").value;
    var lstDanhSachSinhVienTimKiem = danhSachSinhVien.TimKiemSinhVien(tukhoa);
    CapNhatDanhSachSV(lstDanhSachSinhVienTimKiem);
}



function ChinhSuaSinhVien(masv)
{
   
    var sinhvien = danhSachSinhVien.TimSVTheoMa(masv);
    if(sinhvien!=null)
    {
        DomID("masv").value = sinhvien.MaSV;
        DomID("hoten").value = sinhvien.HoTen;
        DomID("cmnd").value = sinhvien.CMND;
        DomID("email").value = sinhvien.Email;
        DomID("sdt").value = sinhvien.SoDT;
    }

}

function LuuThongTin()
{            
    var masv = DomID("masv").value;
    var hoten = DomID("hoten").value;
    var cmnd = DomID("cmnd").value;
    var email = DomID("email").value;
    var sdt = DomID("sdt").value;
    var diemToan = DomID("Toan").value;
    var diemLy =  DomID("Ly").value;
    var diemHoa = DomID("Hoa").value;
    var _id = DomID("idsv").value;
    var loi = 0;
    //Kiểm tra validation
    if(KiemTraDauVaoRong("masv",masv) == true)
    {
        loi++;
    }
    if(KiemTraDauVaoRong("hoten",hoten) == true)
    {
        loi++;
    }
    if(KiemTraDauVaoRong("cmnd",cmnd) == true)
    {
        loi++;
    }   
    if(validate.KiemTraEmail(email))
    {
        document.getElementById("email").style.borderColor = "green";
    }
    else
    {
        document.getElementById("email").style.borderColor = "red";
        loi++;
    }
    if(validate.KiemTraSoDT(sdt))
    {
        document.getElementById("sdt").style.borderColor = "green";
    }
    else
    {
        document.getElementById("sdt").style.borderColor = "red";
        loi++;
    }
    if(loi != 0)
    {
        return ;
    }
    //Thêm sinh viên
    var sinhvien = new SinhVien(masv,hoten,email,sdt,cmnd);
    sinhvien.DiemToan = DomID("Toan").value;
    sinhvien.DiemLy = DomID("Ly").value;
    sinhvien.DiemHoa = DomID("Hoa").value;
    sinhvien.TinhDTB();
    sinhvien.XepLoai();
    console.log(sinhvien)

    var data = {
        maSV: sinhvien.MaSV,
        hoTen: sinhvien.HoTen,
        email: sinhvien.Email,
        xepLoai: sinhvien.Loai,
        soDienThoai: sinhvien.SoDT,
        cmnd: sinhvien.CMND,
        diemToan: Number(sinhvien.DiemToan),
        diemTB: Number(sinhvien.DTB),
        diemLy: Number(sinhvien.DiemLy),
        diemHoa: Number(sinhvien.DiemHoa)
    };

    console.log(data)

    fetch(`http://localhost:3000/api/students/${_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add student');
        }
    })
    .then(data => {
        console.log('New student added:', data);
        var sinhvien = new SinhVien(data.masv, data.hoten, data.email, data.sdt, data.cmnd);
        danhSachSinhVien.ThemSinhVien(sinhvien);
        CapNhatDanhSachSV(danhSachSinhVien);
    })
    .catch(error => {
        console.error('Error adding student:', error);
    });
    console.log(danhSachSinhVien);
    danhSachSinhVien.SuaSinhVien(sinhvien);
    CapNhatDanhSachSV(danhSachSinhVien);
}

