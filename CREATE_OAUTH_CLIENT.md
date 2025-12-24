# 🚀 Tạo OAuth Client ID - Hướng dẫn nhanh

## Bước 1: Cấu hình OAuth Consent Screen (Nếu chưa có)

1. Trong Google Cloud Console, click **"OAuth consent screen"** ở sidebar bên trái
2. Chọn **External** (hoặc Internal nếu dùng Google Workspace)
3. Click **CREATE**
4. Điền thông tin:
   - **App name**: `Nippon Paint` (hoặc tên bạn muốn)
   - **User support email**: Chọn email của bạn
   - **Developer contact email**: Điền email của bạn
5. Click **SAVE AND CONTINUE**
6. Ở màn hình **Scopes**: Click **SAVE AND CONTINUE** (bỏ qua)
7. Ở màn hình **Test users**: Click **SAVE AND CONTINUE** (bỏ qua)
8. Click **BACK TO DASHBOARD**

## Bước 2: Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services** > **Credentials**
2. Click nút **"+ CREATE CREDENTIALS"** ở trên cùng
3. Chọn **"OAuth client ID"**

### Nếu chưa có OAuth consent screen:
- Sẽ hiện popup yêu cầu cấu hình OAuth consent screen
- Click **"CONFIGURE CONSENT SCREEN"** và làm theo Bước 1 ở trên
- Sau đó quay lại bước này

### Nếu đã có OAuth consent screen:
4. Chọn **Application type**: **Web application**
5. Đặt **Name**: `Nippon Paint Web Client` (hoặc tên bạn muốn)
6. **Authorized JavaScript origins**: 
   - Click **"+ ADD URI"**
   - Nhập: `http://localhost:3000`
   - ⚠️ **QUAN TRỌNG**: 
     - Không có dấu `/` ở cuối
     - Phải có `http://`
     - Phải có `:3000`
7. **Authorized redirect URIs** (tùy chọn):
   - Click **"+ ADD URI"**
   - Nhập: `http://localhost:3000`
8. Click **CREATE**

## Bước 3: Copy Client ID

1. Sau khi tạo xong, sẽ hiện popup với **Client ID**
2. Copy Client ID (dạng: `123456789-abc...apps.googleusercontent.com`)
3. Click **OK**

## Bước 4: Thêm vào file .env

1. Mở file `.env` trong project
2. Thêm hoặc sửa dòng:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
   ```
3. Thay `your-client-id-here` bằng Client ID vừa copy
4. Lưu file

## Bước 5: Restart server

```bash
# Dừng server (Ctrl+C)
npm start
```

## Bước 6: Test

1. Refresh browser
2. Thử đăng nhập Google
3. Nếu vẫn lỗi origin_mismatch, đảm bảo đã thêm `http://localhost:3000` vào **Authorized JavaScript origins**

## ⚠️ Lưu ý

- **Authorized JavaScript origins** phải khớp chính xác với URL trong browser
- Nếu dùng port khác (ví dụ: 3001), phải thêm port đó
- Phải click **SAVE** sau khi thêm origin

