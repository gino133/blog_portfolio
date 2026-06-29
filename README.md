# Blog & Portfolio — Hướng dẫn Deploy

## Kiến trúc

```
GitHub (code) → Vercel (frontend Next.js) → yourdomain.com
                Render (backend Express) → MongoDB Atlas
```

---

## Bước 1 — MongoDB Atlas

1. Đăng ký tại [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Tạo **Free Cluster** (M0)
3. **Database Access**: Tạo user `blog_user` với mật khẩu mạnh
4. **Network Access**: Thêm `0.0.0.0/0` (cho phép mọi IP — Render cần điều này)
5. **Connect → Drivers**: Copy connection string dạng:
   ```
   mongodb+srv://blog_user:<password>@cluster0.xxxxx.mongodb.net/blog_portfolio
   ```

---

## Bước 2 — GitHub

1. Tạo repo mới tại [github.com](https://github.com)
2. Push code lên:
   ```bash
   cd project
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/your-repo.git
   git push -u origin main
   ```

---

## Bước 3 — Deploy Backend lên Render

1. Đăng ký [render.com](https://render.com) → **New Web Service**
2. Kết nối GitHub repo, chọn thư mục `backend`
3. Cấu hình:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Node version**: 20
4. **Environment Variables** (thêm từng biến):
   ```
   MONGODB_URI     = mongodb+srv://...
   JWT_SECRET      = your_super_secret_32_char_min
   JWT_EXPIRES_IN  = 7d
   NODE_ENV        = production
   FRONTEND_URL    = https://your-app.vercel.app
   ADMIN_EMAIL     = admin@yourdomain.com
   ADMIN_PASSWORD  = StrongPassword123!
   ```
5. Deploy → Copy URL: `https://your-api.onrender.com`

### Tạo tài khoản admin (chỉ làm 1 lần)

Sau khi deploy backend, gọi API:
```bash
curl -X POST https://your-api.onrender.com/api/auth/seed-admin
```
Sau đó **đừng gọi lại** endpoint này nữa.

---

## Bước 4 — Deploy Frontend lên Vercel

1. Đăng ký [vercel.com](https://vercel.com) → **New Project**
2. Import GitHub repo, chọn thư mục `frontend`
3. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL  = https://your-api.onrender.com/api
   NEXT_PUBLIC_SITE_URL = https://yourdomain.com
   NEXT_PUBLIC_SITE_NAME = Tên website của bạn
   ```
4. Deploy → Vercel cung cấp URL: `https://your-app.vercel.app`

---

## Bước 5 — Kết nối tên miền (Domain)

### Trên Vercel:
1. Project Settings → **Domains**
2. Thêm `yourdomain.com` và `www.yourdomain.com`
3. Vercel cung cấp DNS records cần thêm

### Tại nhà cung cấp tên miền (GoDaddy, Namecheap, PA Vietnam...):
```
Type    Name    Value
A       @       76.76.19.61         (IP Vercel — kiểm tra trong Vercel dashboard)
CNAME   www     cname.vercel-dns.com
```

### Cập nhật CORS trên Render:
Thêm biến môi trường:
```
FRONTEND_URL_2 = https://yourdomain.com
```

---

## Bước 6 — Truy cập Admin

```
https://yourdomain.com/admin/login
Email: admin@yourdomain.com (hoặc giá trị ADMIN_EMAIL)
Password: (giá trị ADMIN_PASSWORD bạn đặt)
```

---

## Cấu trúc thư mục

```
project/
├── backend/
│   ├── src/
│   │   ├── server.js          ← Entry point
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   ├── products.js
│   │   │   └── dashboard.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── layout.js           ← Root layout
│   │   ├── page.js             ← Homepage
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── layout.js       ← Admin shell + auth guard
│   │       ├── login/page.js
│   │       ├── dashboard/page.js
│   │       ├── posts/
│   │       │   ├── page.js
│   │       │   └── PostForm.js
│   │       └── products/
│   │           ├── page.js
│   │           └── ProductForm.js
│   ├── src/lib/
│   │   ├── api.js              ← Axios instance + API helpers
│   │   └── auth-context.js     ← Auth state (React Context)
│   ├── .env.example
│   └── package.json
│
└── .github/
    └── workflows/
        └── deploy.yml          ← CI/CD tự động
```

---

## API Endpoints

| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| POST | /api/auth/login | — | Đăng nhập |
| GET | /api/auth/me | ✓ | Thông tin user |
| GET | /api/posts | — | Danh sách bài viết |
| GET | /api/posts/:slug | — | Chi tiết bài viết |
| GET | /api/posts/admin/all | ✓ | Admin: tất cả bài viết |
| POST | /api/posts | ✓ | Tạo bài viết |
| PUT | /api/posts/:id | ✓ | Cập nhật bài viết |
| DELETE | /api/posts/:id | ✓ | Xóa bài viết |
| GET | /api/products | — | Danh sách sản phẩm |
| POST | /api/products | ✓ | Thêm sản phẩm |
| PUT | /api/products/:id | ✓ | Cập nhật sản phẩm |
| DELETE | /api/products/:id | ✓ | Xóa sản phẩm |
| GET | /api/dashboard/stats | ✓ | Thống kê dashboard |

---

## Lưu ý bảo mật

- ❗ Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên >= 32 ký tự
- ❗ Đổi `ADMIN_PASSWORD` thành mật khẩu mạnh
- ❗ Sau khi tạo admin, **không** gọi lại `/api/auth/seed-admin`
- ✅ Tất cả routes admin đều yêu cầu JWT token
- ✅ Rate limiting trên auth endpoints (20 req/15 phút)
- ✅ Helmet.js bảo vệ HTTP headers
- ✅ CORS chỉ cho phép domain đã cấu hình
