import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function seed() {
  console.log("清理旧数据...");
  await p.notification.deleteMany();
  await p.report.deleteMany();
  await p.favorite.deleteMany();
  await p.foodReview.deleteMany();
  await p.exam.deleteMany();
  await p.secondhand.deleteMany();
  await p.rental.deleteMany();
  await p.interview.deleteMany();
  await p.referral.deleteMany();
  await p.image.deleteMany();
  await p.verificationCode.deleteMany();
  await p.user.deleteMany();
  console.log("旧数据已清理");

  // 管理员账号
  const admin = await p.user.create({
    data: {
      phone: "13800000000",
      nickname: "管理员",
      role: "admin",
      school: "华北理工大学",
      certified: true,
      eduEmail: "admin@ncst.edu.cn",
    },
  });
  console.log("管理员账号已创建: 13800000000");

  const uids = [admin.id];
  for (let i = 1; i <= 50; i++) {
    const certified = i < 30;
    const data = {
      phone: '1380000' + String(i).padStart(4, '0'),
      nickname: '同学' + i,
      school: '华北理工大学',
      major: ['计算机科学','软件工程','电子信息','机械工程','土木工程'][Math.floor(Math.random()*5)],
      certified,
    };
    if (certified) data.eduEmail = 'stu' + i + '@ncst.edu.cn';
    const u = await p.user.create({ data });
    uids.push(u.id);
  }

  let count = 0;
  for (let d = 29; d >= 0 && count < 240; d--) {
    const vals = [5,12,8,24,18,30,15,7,22,11];
    const cats = [1,1,2,3,4,1,2,3,4,5];
    const n = vals[d % vals.length];
    for (let j = 0; j < n && count < 240; j++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const uid = uids[Math.floor(Math.random() * uids.length)];
      if (cat === 1) {
        if (Math.random() > 0.5) {
          await p.referral.create({ data: { userId: uid, company: ['字节跳动','阿里巴巴','腾讯','美团'][Math.floor(Math.random()*4)], position: ['后端开发','前端开发','产品经理','数据分析'][Math.floor(Math.random()*4)], referralCode: 'BT2026' + Math.floor(Math.random()*1000), description: '校招内推信息 #' + count } });
        } else {
          await p.interview.create({ data: { userId: uid, title: '面经分享 #' + count, company: ['字节跳动','阿里巴巴','腾讯','美团'][Math.floor(Math.random()*4)], position: '软件工程师', round: ['一面','二面','终面'][Math.floor(Math.random()*3)], passed: Math.random() > 0.4, experience: '面试经验 #' + count } });
        }
      } else if (cat === 2) {
        await p.rental.create({ data: { userId: uid, title: ['两室一厅','单间出租','找室友','主卧招租'][Math.floor(Math.random()*4)], area: ['东区','西区','北区','南区'][Math.floor(Math.random()*4)], price: Math.floor(Math.random()*2000)+500, community: '理工附近' } });
      } else if (cat === 3) {
        await p.secondhand.create({ data: { userId: uid, title: ['数据结构教材','机械键盘','GRE词汇书','自行车','台灯'][Math.floor(Math.random()*5)], price: Math.floor(Math.random()*200)+5, category: ['书本','生活用品','非实体'][Math.floor(Math.random()*3)] } });
      } else if (cat === 4) {
        await p.foodReview.create({ data: { userId: uid, restaurant: ['食堂三楼','西区火锅','东区卤味','北区烧烤'][Math.floor(Math.random()*4)], rating: Math.floor(Math.random()*3)+3, review: '美食推荐 #' + count } });
      } else {
        await p.exam.create({ data: { userId: uid, title: ['考研经验分享','考公备考心得','计算机考研经验','面试技巧'][Math.floor(Math.random()*4)], category: Math.random() > 0.4 ? '考研' : '考公', subject: ['英语','政治','数学','专业课'][Math.floor(Math.random()*4)], content: '备考经验 #' + count } });
      }
      count++;
    }
  }

  for (let i = 0; i < 10; i++) {
    await p.notification.create({ data: { userId: uids[Math.floor(Math.random() * uids.length)], type: ['favorite','system'][Math.floor(Math.random()*2)], title: '系统通知', content: '欢迎使用校园通！通知 #' + (i+1) } });
  }

  console.log(`已插入 ${uids.length} 个用户, ${count} 条内容, 10 条通知`);
  await p.$disconnect();
}

seed();