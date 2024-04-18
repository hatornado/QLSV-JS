function SinhVien(masv,hoten,email,sodt,cmnd)
{
    this.MaSV = masv;
    this.HoTen = hoten;
    this.Email = email;
    this.SoDT = sodt;
    this.CMND = cmnd;
    this.DiemToan = '';
    this.DiemLy ='';
    this.DiemHoa ='';
    this.DTB ='';
    this.Loai ='';

    this.TinhDTB = function (){
        this.DTB = (Number(this.DiemHoa) + Number(this.DiemLy) + Number(this.DiemToan)) / 3;
    }

    this.XepLoai = function(){
        if(this.DTB <= 10 && this.DTB >= 8) {
            this.Loai = "Xếp loại Giỏi";
        } else if (this.DTB < 8 && this.DTB >= 6.5) {
            this.Loai = "Xếp loại Khá";
        } else if (this.DTB < 6.5 && this.DTB >= 5) {
            this.Loai = "Xếp loại Trung Bình";
        } else {
            this.Loai = "Xếp loại yếu";
        }
    }
}
