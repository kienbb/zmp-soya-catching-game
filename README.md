# Soya Catching Game

Game hứng đậu nành vui nhộn với hệ thống streak và lời chúc may mắn. Game được phát triển với HTML, CSS và JavaScript thuần.

![Soya Catching Game](public/assets/images/logo.png)

## Tính năng

- Ba loại đậu tốt với màu sắc khác nhau: Tình duyên (tím), Sức khỏe (xanh lá), Tài lộc (vàng)
- Đậu vàng đặc biệt có thể giữ streak của đậu trước đó
- Đậu xấu sẽ làm mất mạng
- Hệ thống streak lên đến x10 với lời chúc tăng dần
- Quay may mắn với nhiều phần thưởng
- Bảng xếp hạng lưu trữ điểm cao
- Đổi đậu thành phần thưởng
- Ba cấp độ khó dễ khác nhau

## Cách chơi

1. Điền thông tin cá nhân (tên, số điện thoại, tuổi)
2. Chọn độ khó
3. Di chuyển giỏ để hứng đậu nành
4. Bắt đậu cùng màu liên tiếp để nhận điểm thưởng streak
5. Né đậu xấu (màu đỏ) để tránh mất mạng
6. Hoàn thành trong thời gian giới hạn để nhận đậu
7. Dùng đậu để đổi phần thưởng và quay may mắn

## Cài đặt và chạy

1. Clone repository
2. Mở file `public/index.html` trong trình duyệt
3. Hoặc tạo một HTTP server đơn giản:
   ```
   python -m http.server 8000 --directory public
   ```
4. Truy cập http://localhost:8000

## Phát triển

Game được phát triển bằng:
- HTML5
- CSS3
- JavaScript thuần (không sử dụng framework)

Cấu trúc thư mục:
- `public/`: Thư mục chính của game
  - `assets/`: Chứa hình ảnh và SVG
  - `css/`: Chứa file CSS
  - `js/`: Chứa file JavaScript
  - `index.html`: File HTML chính

## Giấy phép

© 2023 ZMP Soya Catching Game. All rights reserved. 