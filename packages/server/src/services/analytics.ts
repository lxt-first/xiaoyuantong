import prisma from "./prisma";

function dateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const start = new Date(from + "T00:00:00.000+08:00");
  const end = new Date(to + "T23:59:59.999+08:00");
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const CATEGORY_COLORS: Record<string, string> = {
  career: "#2563EB", rental: "#16A34A", secondhand: "#DC2626", life: "#F59E0B", exam: "#7C3AED",
};

function dayStart(date: string): Date {
  return new Date(date + "T00:00:00.000+08:00");
}

function dayEnd(date: string): Date {
  return new Date(date + "T23:59:59.999+08:00");
}

export async function getDashboardOverview(from: string, to: string) {
  const start = dayStart(from);
  const end = dayEnd(to);

  const [totalUsers, totalCertified] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { certified: true } }),
  ]);

  // Range-filtered content counts
  const whereRange = { createdAt: { gte: start, lte: end } };
  const [newReferrals, newInterviews, newRentals, newSecondhands, newFoods, newExams, totalReports] =
    await Promise.all([
      prisma.referral.count({ where: whereRange }),
      prisma.interview.count({ where: whereRange }),
      prisma.rental.count({ where: whereRange }),
      prisma.secondhand.count({ where: whereRange }),
      prisma.foodReview.count({ where: whereRange }),
      prisma.exam.count({ where: whereRange }),
      prisma.report.count({ where: whereRange }),
    ]);

  const newContent = newReferrals + newInterviews + newRentals + newSecondhands + newFoods + newExams;
  const totalContentAll = (await Promise.all([
    prisma.referral.count(), prisma.interview.count(), prisma.rental.count(),
    prisma.secondhand.count(), prisma.foodReview.count(), prisma.exam.count(),
  ])).reduce((a, b) => a + b, 0);

  const certifiedPublishingRate = totalUsers > 0 ? totalCertified / totalUsers : 0;

  // Active users in range
  const activeUserIds = new Set<string>();
  const userIdResults = await Promise.all([
    prisma.referral.findMany({ where: whereRange, select: { userId: true } }),
    prisma.interview.findMany({ where: whereRange, select: { userId: true } }),
    prisma.rental.findMany({ where: whereRange, select: { userId: true } }),
    prisma.secondhand.findMany({ where: whereRange, select: { userId: true } }),
    prisma.foodReview.findMany({ where: whereRange, select: { userId: true } }),
    prisma.exam.findMany({ where: whereRange, select: { userId: true } }),
  ]);
  for (const items of userIdResults) for (const item of items) activeUserIds.add(item.userId);

  // New users in range
  const newUsers = await prisma.user.count({ where: { createdAt: { gte: start, lte: end } } });

  // Total views across all content (all time, for aggregate metric)
  const viewCounts = await Promise.all([
    prisma.referral.aggregate({ _sum: { viewCount: true } }),
    prisma.interview.aggregate({ _sum: { viewCount: true } }),
    prisma.rental.aggregate({ _sum: { viewCount: true } }),
    prisma.secondhand.aggregate({ _sum: { viewCount: true } }),
    prisma.foodReview.aggregate({ _sum: { viewCount: true } }),
    prisma.exam.aggregate({ _sum: { viewCount: true } }),
  ]);
  const totalViews = viewCounts.reduce((sum, v) => sum + (v._sum.viewCount || 0), 0);

  return {
    totalUsers,
    totalCertified,
    activeUsers: activeUserIds.size,
    newUsers,
    newContent,
    averageViewsPerPost: totalContentAll > 0 ? Math.round(totalViews / totalContentAll) : 0,
    certifiedPublishingRate: Math.round(certifiedPublishingRate * 100) / 100,
    perCapitaViews: totalUsers > 0 ? Math.round(totalViews / totalUsers) : 0,
    reportRate: newContent > 0 ? Math.round((totalReports / newContent) * 10000) / 10000 : 0,
    totalViews,
    totalContent: totalContentAll,
  };
}

export async function getTrends(from: string, to: string) {
  const dates = dateRange(from, to);

  const newUsers: { date: string; value: number }[] = [];
  const newContent: { date: string; value: number }[] = [];
  const totalViews: { date: string; value: number }[] = [];

  const results = await Promise.all(
    dates.map(async (d) => {
      const start = dayStart(d);
      const end = dayEnd(d);
      const [usersOnDay, refs, intvs, rents, shs, foods, exams] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.referral.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.interview.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.rental.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.secondhand.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.foodReview.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.exam.count({ where: { createdAt: { gte: start, lte: end } } }),
      ]);
      return { date: d, usersOnDay, content: refs + intvs + rents + shs + foods + exams };
    })
  );

  for (const r of results) {
    newUsers.push({ date: r.date, value: r.usersOnDay });
    newContent.push({ date: r.date, value: r.content });
    totalViews.push({ date: r.date, value: 0 });
  }

  return { newUsers, newContent, totalViews };
}

export async function getCategoryBreakdown(from: string, to: string) {
  const start = dayStart(from);
  const end = dayEnd(to);
  const whereRange = { createdAt: { gte: start, lte: end } };

  const [referrals, interviews, rentals, secondhands, foods, exams] = await Promise.all([
    prisma.referral.count({ where: whereRange }),
    prisma.interview.count({ where: whereRange }),
    prisma.rental.count({ where: whereRange }),
    prisma.secondhand.count({ where: whereRange }),
    prisma.foodReview.count({ where: whereRange }),
    prisma.exam.count({ where: whereRange }),
  ]);

  return [
    { category: "career", label: "校招内推", count: referrals + interviews, color: CATEGORY_COLORS.career },
    { category: "rental", label: "租房找房", count: rentals, color: CATEGORY_COLORS.rental },
    { category: "secondhand", label: "二手交易", count: secondhands, color: CATEGORY_COLORS.secondhand },
    { category: "life", label: "生活信息", count: foods, color: CATEGORY_COLORS.life },
    { category: "exam", label: "考研考公", count: exams, color: CATEGORY_COLORS.exam },
  ];
}

export async function getContentQuality(from: string, to: string) {
  const start = dayStart(from);
  const end = dayEnd(to);
  const whereRange = { createdAt: { gte: start, lte: end } };

  const [totalReports, totalReferrals, totalInterviews, totalRentals, totalSecondhands, totalFoods, totalExams] =
    await Promise.all([
      prisma.report.count({ where: whereRange }),
      prisma.referral.count({ where: whereRange }),
      prisma.interview.count({ where: whereRange }),
      prisma.rental.count({ where: whereRange }),
      prisma.secondhand.count({ where: whereRange }),
      prisma.foodReview.count({ where: whereRange }),
      prisma.exam.count({ where: whereRange }),
    ]);

  const totalPosts = totalReferrals + totalInterviews + totalRentals + totalSecondhands + totalFoods + totalExams;
  const reportRate = totalPosts > 0 ? totalReports / totalPosts : 0;

  return { reportRate: Math.round(reportRate * 10000) / 10000, totalReports, totalPosts };
}
