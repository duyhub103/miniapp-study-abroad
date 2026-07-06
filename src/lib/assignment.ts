export interface Consultant {
  name: string;
  phone: string;
  email: string;
  countries: string[];
}

export const CONSULTANTS: Consultant[] = [
  {
    name: "Trần Hoàng Duy",
    phone: "0901234567",
    email: "hoangduy.tran@duhocbinhduong.vn",
    countries: ["Úc", "Canada", "Mỹ", "Anh", "New Zealand"],
  },
  {
    name: "Trần Tấn Phúc",
    phone: "0912345678",
    email: "tanphuc.tran@duhocbinhduong.vn",
    countries: ["Nhật Bản", "Hàn Quốc", "Đài Loan", "Singapore"],
  },
  {
    name: "Phạm Đăng Hoàng Hiếu",
    phone: "0923456789",
    email: "hoanghieu.pham@duhocbinhduong.vn",
    countries: ["Đức", "Chưa xác định"],
  },
];

export function getAssignedConsultant(targetCountry: string): string {
  const matched = CONSULTANTS.find((c) => c.countries.includes(targetCountry));
  return matched ? matched.name : "Phạm Đăng Hoàng Hiếu";
}
