# Pharmacy Frontend - Hệ thống Quản lý Dược phẩm

Bài test Frontend ReactJS kết nối API Hệ thống Cơ sở dữ liệu về Dược Quốc gia (Sandbox).

## Tính năng đã hoàn thành

- [x] Đăng nhập (POST /auth/login) – password Base64 + form-urlencoded
- [x] Lưu access_token vào localStorage + bảo vệ route
- [x] Danh mục Thuốc (GET /master/drugs) + phân trang
- [x] Form tạo Phiếu Nhập kho (POST /transactions/stock-in)
- [x] Validation: quantity (số nguyên dương), price (≥ 0, max 2 số thập phân), ít nhất 1 dòng thuốc
- [x] Xử lý lỗi API + hiển thị thông báo
- [x] Tra cứu trạng thái phiếu nhập (GET /transactions/stock-in/{id}/status)

## Công nghệ sử dụng

- ReactJS + TypeScript
- Vite
- Ant Design
- Axios
- React Router DOM
- Day.js
