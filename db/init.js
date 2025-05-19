// init.js
db = db.getSiblingDB('mydb'); // 사용할 DB

// 계정 생성
db.users.insertMany([
  {
    email: 'admin@nexon.com',
    password: '$2b$10$JX8DkbVAvn.DoEFwYhcO/uspAHni1mUrbvgtneau7baPNJLc0XKdO',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    email: 'auditor@nexon.com',
    password: '$2b$10$JX8DkbVAvn.DoEFwYhcO/uspAHni1mUrbvgtneau7baPNJLc0XKdO',
    role: 'auditor',
    createdAt: new Date(),
  },
  {
    email: 'operator@nexon.com',
    password: '$2b$10$JX8DkbVAvn.DoEFwYhcO/uspAHni1mUrbvgtneau7baPNJLc0XKdO',
    role: 'operator',
    createdAt: new Date(),
  },
  {
    email: 'user@nexon.com',
    password: '$2b$10$JX8DkbVAvn.DoEFwYhcO/uspAHni1mUrbvgtneau7baPNJLc0XKdO',
    role: 'user',
    createdAt: new Date(),
  },
]);

// EventRewardItem 컬렉션에 초기 보상 아이템 데이터 삽입
db.eventrewarditems.insertMany([
  {
    name: '쿠폰',
    type: 'coupon',
    description: '할인 쿠폰 아이템',
    createdAt: new Date(),
  },
  {
    name: '장검',
    type: 'item',
    description: '강력한 장검 무기 아이템',
    createdAt: new Date(),
  },
  {
    name: '포인트',
    type: 'point',
    description: '사용자 포인트 적립',
    createdAt: new Date(),
  },
]);

db.eventgoalitems.insertMany([
  {
    _id: ObjectId(), // or 생략해도 자동 생성됨
    description: '아이템 구매',
    conditionType: 'purchase_count', // 임의로 구분하기 쉽게
    targetValue: 10, // 목표 달성 기준 (예: 10회 구매)
  },
]);
