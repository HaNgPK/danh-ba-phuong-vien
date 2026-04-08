import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.contact.deleteMany({});
  await prisma.actionButton.deleteMany({});
  await prisma.groupScope.deleteMany({});
  await prisma.village.deleteMany({});

  const pv = await prisma.village.create({
    data: {
      slug: 'phuong-vien',
      name: 'Phương Viên',
      fullName: 'Làng Phương Viên',
      address: 'Xã Sơn Đồng, Huyện Hoài Đức, Hà Nội',
      logoUrl: 'https://via.placeholder.com/150',
      primaryColor: '#1a365d',
      facebookUrl: 'https://facebook.com/phuongvien',
      zaloUrl: 'https://zalo.me/g/phuongvien',
      emergencyPolicePhone: '02433221668',
      emergencyHealthPhone: '0987654321',
      groupScopes: {
        create: [
          { code: 'thon1', name: 'Thôn Phương Viên 1', order: 1 },
          { code: 'thon2', name: 'Thôn Phương Viên 2', order: 2 },
        ]
      },
      actionButtons: {
        create: [
          { type: 'emergency', label: 'Gọi Công an Xã', url: 'tel:02433221668', icon: 'ShieldAlert', order: 1 },
          { type: 'social', label: 'Zalo Cư dân', url: 'https://zalo.me/g/x', icon: 'MessageCircle', order: 2 },
        ]
      }
    }
  });

  const daimo = await prisma.village.create({
    data: {
      slug: 'dai-mo',
      name: 'Đại Mỗ',
      fullName: 'Phường Đại Mỗ',
      address: 'Quận Nam Từ Liêm, Hà Nội',
      logoUrl: 'https://via.placeholder.com/150/FF0000',
      primaryColor: '#DC2626',
      facebookUrl: 'https://facebook.com/daimo',
      zaloUrl: 'https://zalo.me/g/daimo',
      emergencyPolicePhone: '113',
      emergencyHealthPhone: '115',
      groupScopes: {
        create: [
          { code: 'todanpho1', name: 'Tổ dân phố 1', order: 1 },
          { code: 'todanpho2', name: 'Tổ dân phố 2', order: 2 },
        ]
      }
    }
  });

  console.log('Seeded successfully with villages:', pv.slug, daimo.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
