export default function Footer() {
  return (
    <footer className="p-0 border-gray-300 w-full font-roboto ">
      <div className="bg-[#F8FAF4] p-5 box-border">
        <div className="flex justify-between text-left">
          <div className="flex-1 pl-20 pr-12">
            <h3 className="text-lg font-semibold">Về greenNova</h3>
            <p className="w-full max-w-xs text-left">
              Tree planting is the act of planting young trees, shrubs, or other
              woody plants into the ground to establish new.
            </p>
          </div>
          <div className="flex-1 px-12">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <ul className="list-none p-0">
              <li className="mb-2">Số 3 Cầu Giấy, Láng Thượng, Hà Nội</li>
              <li className="mb-2">+84 0123 123 123</li>
              <li>support@infor.com</li>
            </ul>
          </div>

          <div className="flex-1 px-12">
            <h3 className="text-lg font-semibold">Liên kết</h3>
            <ul className="list-none p-0">
              <li className="mb-2 relative pl-4">
                <a href="#" className="text-black no-underline">
                  Home Page
                </a>
                <span className="absolute left-0 text-[#4BAF47]">{">"}</span>
              </li>
              <li className="mb-2 relative pl-4">
                <a href="#" className="text-black no-underline">
                  About Us
                </a>
                <span className="absolute left-0 text-[#4BAF47]">{">"}</span>
              </li>
              <li className="mb-2 relative pl-4">
                <a href="#" className="text-black no-underline">
                  Marketplace
                </a>
                <span className="absolute left-0 text-[#4BAF47]">{">"}</span>
              </li>
              <li className="mb-2 relative pl-4">
                <a href="#" className="text-black no-underline">
                  Product
                </a>
                <span className="absolute left-0 text-[#4BAF47]">{">"}</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 pr-20">
            <h3 className="text-lg font-semibold">Tin tức</h3>
            <p className="w-full max-w-xs text-left">
              Tree planting is the act of planting young trees, shrubs, or other
              woody plants into the ground to establish new.
            </p>
          </div>
        </div>
      </div>

      <div className="container flex justify-center items-center h-[60px] mx-auto py-3 bg-brand-primary">
        <p className="text-white my-0">
          &copy; Copyright 2024 GreenNova All Right Reserved
        </p>
      </div>
    </footer>
  );
}
