import fs from 'fs';

let content = fs.readFileSync('src/components/DirectoryClient.tsx', 'utf-8');

content = content.replace(
  /Phương Viên\s*<\/h1>/,
  '{village ? village.name : "Phương Viên"}\n          </h1>'
);

content = content.replace(
  /<div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 p-2 border-4 border-white\/20">\s*<div className="w-full h-full rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center text-blue-900 font-bold text-xs">\s*LOGO\s*<\/div>\s*<\/div>/,
  `<div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 p-2 border-4 border-white/20 overflow-hidden">
            {village?.logoUrl ? (
              <img src={village.logoUrl} alt="Logo" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center text-blue-900 font-bold text-xs">
                LOGO
              </div>
            )}
          </div>`
);

content = content.replace(
  /LÀNG PHƯƠNG VIÊN\s*<\/h2>/,
  '{village ? village.fullName.toUpperCase() : "LÀNG PHƯƠNG VIÊN"}\n          </h2>'
);

content = content.replace(
  /Xã Sơn Đồng, Thành phố Hà Nội\s*<\/p>/g,
  '{village ? village.address : "Xã Sơn Đồng, Thành phố Hà Nội"}\n          </p>'
);

content = content.replace(
  /href="tel:02433221668"/g,
  'href={village?.emergencyPolicePhone ? `tel:${village.emergencyPolicePhone}` : "tel:02433221668"}'
);

content = content.replace(
  /href="tel:0987654321"/g,
  'href={village?.emergencyHealthPhone ? `tel:${village.emergencyHealthPhone}` : "tel:0987654321"}'
);

content = content.replace(
  /href="https:\/\/facebook\.com\/"/g,
  'href={village?.facebookUrl || "https://facebook.com/"}'
);

content = content.replace(
  /Làng Phương Viên\s*<\/h2>/g,
  '{village?.fullName || "Làng Phương Viên"}\n            </h2>'
);

content = content.replace(
  /© 2026 Làng Phương Viên\. Bảo lưu mọi quyền\./g,
  '© 2026 {village?.fullName || "Làng Phương Viên"}. Bảo lưu mọi quyền.'
);

fs.writeFileSync('src/components/DirectoryClient.tsx', content);
console.log('Done replacement');
