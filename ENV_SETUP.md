# Hướng dẫn cấu hình file .env

## Tạo file .env

1. Tạo file `.env` trong thư mục root của project (cùng cấp với `package.json`)

2. Copy nội dung từ file `.env.example` (nếu có) hoặc thêm nội dung sau:

```env
# Google OAuth Client ID
# Lấy từ Google Cloud Console: https://console.cloud.google.com/
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Template file .env:**
```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Lấy Google Client ID

### Bước 1: Truy cập Google Cloud Console
- Vào: https://console.cloud.google.com/
- Đăng nhập bằng tài khoản Google

### Bước 2: Tạo Project (nếu chưa có)
- Click vào dropdown project ở trên cùng
- Click "New Project"
- Đặt tên project (ví dụ: "Nippon Paint OAuth")
- Click "Create"

### Bước 3: Bật Google+ API
- Vào **APIs & Services** > **Library**
- Tìm "Google+ API" hoặc "Google Identity Services"
- Click vào và bấm **Enable**

### Bước 4: Tạo OAuth 2.0 Client ID
- Vào **APIs & Services** > **Credentials**
- Click **+ CREATE CREDENTIALS** > **OAuth client ID**
- Nếu chưa có OAuth consent screen, sẽ phải cấu hình:
  - Chọn **External** (hoặc Internal nếu dùng Google Workspace)
  - Điền App name: "Nippon Paint"
  - Chọn User support email
  - Thêm Developer contact email
  - Click **Save and Continue**
  - Bỏ qua Scopes (click **Save and Continue**)
  - Bỏ qua Test users (click **Save and Continue**)
  - Click **Back to Dashboard**

### Bước 5: Tạo OAuth Client ID
- Chọn **Application type**: **Web application**
- Đặt tên: "Nippon Paint Web Client"
- **Authorized JavaScript origins**: 
  - ⚠️ **QUAN TRỌNG**: Thêm chính xác URL bạn đang dùng
  - `http://localhost:3000` (cho development - port 3000)
  - `http://localhost:3001` (nếu bạn dùng port khác)
  - `https://yourdomain.com` (cho production - thêm sau)
  - ⚠️ **Lưu ý**: 
    - Không có dấu `/` ở cuối
    - Phải khớp chính xác với URL trong browser (bao gồm http/https)
    - Nếu dùng port khác, phải thêm port đó
- **Authorized redirect URIs**: 
  - `http://localhost:3000` (cho development)
  - `https://yourdomain.com` (cho production - thêm sau)
- Click **Create**
- Copy **Client ID** (dạng: `123456789-abcdefg.apps.googleusercontent.com`)

### Bước 6: Cấu hình trong project
- Mở file `.env` đã tạo
- Thay `your-google-client-id-here` bằng Client ID vừa copy
- Lưu file

### Bước 7: Restart development server
```bash
# Dừng server hiện tại (Ctrl+C)
# Chạy lại
npm start
```

**⚠️ QUAN TRỌNG**: Create React App chỉ đọc file `.env` khi server khởi động. Bạn **PHẢI** restart server sau khi tạo/sửa file `.env`.

## Ví dụ file .env

```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

## Lưu ý quan trọng

- ⚠️ **KHÔNG commit file `.env` vào git** (đã có trong .gitignore)
- ✅ File `.env` chỉ dùng cho local development
- ✅ Cho production, thêm domain thật vào Google Cloud Console
- ✅ Có thể tạo nhiều Client ID cho nhiều môi trường (dev, staging, production)

## Troubleshooting

### ❌ Lỗi: "Error 400: origin_mismatch" (QUAN TRỌNG!)

**Đây là lỗi phổ biến nhất!**

**Nguyên nhân:**
- URL hiện tại (origin) chưa được thêm vào Google Cloud Console
- URL không khớp chính xác (sai port, sai http/https, có dấu `/` ở cuối)

**Cách fix:**

1. **Kiểm tra URL hiện tại trong browser:**
   - Xem thanh address bar, copy chính xác URL (ví dụ: `http://localhost:3000`)

2. **Vào Google Cloud Console:**
   - Truy cập: https://console.cloud.google.com/
   - Vào **APIs & Services** > **Credentials**
   - Click vào OAuth 2.0 Client ID của bạn

3. **Thêm Authorized JavaScript origins:**
   - Tìm phần **Authorized JavaScript origins**
   - Click **+ ADD URI**
   - Thêm chính xác URL bạn đang dùng:
     - `http://localhost:3000` (nếu đang chạy ở port 3000)
     - `http://localhost:3001` (nếu đang chạy ở port khác)
     - ⚠️ **Lưu ý**: 
       - Không có dấu `/` ở cuối
       - Phải có `http://` hoặc `https://`
       - Phải có port nếu không phải port 80/443

4. **Lưu thay đổi:**
   - Click **SAVE** ở cuối trang
   - Đợi vài giây để Google cập nhật

5. **Test lại:**
   - Refresh trang web
   - Thử đăng nhập Google lại

**Ví dụ:**
- Nếu browser hiển thị: `http://localhost:3000` → Thêm `http://localhost:3000`
- Nếu browser hiển thị: `http://127.0.0.1:3000` → Thêm `http://127.0.0.1:3000`
- Nếu browser hiển thị: `https://myapp.com` → Thêm `https://myapp.com`

### Lỗi: "Invalid client"
- Kiểm tra Client ID đã đúng chưa
- Đảm bảo đã thêm `http://localhost:3000` vào Authorized JavaScript origins

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra redirect URI trong Google Cloud Console
- Phải khớp chính xác với URL hiện tại (bao gồm http/https và port)

### Google button không hiển thị
- Mở console (F12) xem log: `🔍 Google OAuth Check`
- Nếu `hasClientId: false` → Kiểm tra file `.env` và restart server
- Đảm bảo file `.env` ở đúng vị trí (cùng cấp với `package.json`)
- Đảm bảo tên biến có prefix `REACT_APP_`

