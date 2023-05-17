'use strict';

const tableName = 'courses';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(tableName, data, {
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, {});
  },
};

const data = [
  'BAA00101,Triết học Mác - Lênin,3,45,0,0,BB,1',
  'BAA00102,Kinh tế chính trị Mác - Lênin,2,30,0,0,BB,1',
  'BAA00103,Chủ nghĩa xã hội khoa học,2,30,0,0,BB,1',
  'BAA00104,Lịch sử Đảng Cộng sản Việt Nam,2,30,0,0,BB,1',
  'BAA00003,Tư tưởng Hồ Chí Minh,2,30,0,0,BB,1',
  'BAA00004,Pháp luật đại cương,3,45,0,0,BB,1',
  'BAA00005,Kinh tế đại cương,2,30,0,0,TC,1',
  'BAA00006,Tâm lý đại cương,2,30,0,0,TC,1',
  'BAA00007,Phương pháp luận sáng tạo,2,30,0,0,TC,1',
  'MTH00005,Vi tích phân 1,4,45,30,0,BB,1',
  'MTH00006,Vi tích phân 2,4,45,30,0,BB,1',
  'MTH00007,Xác suất thống kê,4,45,30,0,BB,1',
  'MTH00008,Đại số tuyến tính,4,45,30,0,BB,1',
  'MTH00009,Toán rời rạc,4,45,30,0,BB,1',
  'MTH00050,Toán học tổ hợp,4,45,30,0,BB,1',
  'CSC00004,Nhập môn Công nghệ thông tin,4,45,30,0,BB,1',
  'MTH00051,Toán ứng dụng và thống kê,4,45,30,0,TC,1',
  'MTH00052,Phương pháp tính,4,45,30,0,TC,1',
  'MTH00053,Lý thuyết số,4,45,30,0,TC,1',
  'MTH00054,Phép tính vị từ,4,45,30,0,TC,1',
  'CSC10001,Nhập môn lập trình,4,45,30,0,BB,2',
  'CSC10002,Kỹ thuật lập trình,4,45,30,0,BB,2',
  'CSC10003,Phương pháp lập trình hướng đối tượng,4,45,30,0,BB,2',
  'CSC10004,Cấu trúc dữ liệu và giải thuật,4,45,30,0,BB,2',
  'CSC10006,Cơ sở dữ liệu,4,45,30,0,BB,2',
  'CSC10007,Hệ điều hành,4,45,30,0,BB,2',
  'CSC10008,Mạng máy tính,4,45,30,0,BB,2',
  'CSC10009,Hệ thống máy tính,2,30,0,0,BB,2',
  'CSC13002,Nhập môn công nghệ phần mềm,4,45,30,0,BB,2',
  'CSC14003,Cơ sở trí tuệ nhân tạo,4,45,30,0,BB,2',
  'CSC13003,Kiểm thử phần mềm,4,45,30,0,TC,3',
  'CSC13005,Phân tích và quản lý yêu cầu phần mềm,4,45,30,0,TC,3',
  'CSC13006,Quản lý dự án phần mềm,4,45,30,0,TC,3',
  'CSC13007,Phát triển game,4,45,30,0,TC,3',
  'CSC13008,Phát triển ứng dụng web,4,45,30,0,TC,3',
  'CSC13009,Phát triển phần mềm cho thiết bị di động,4,45,30,0,TC,3',
  'CSC13010,Thiết kế phần mềm,4,45,30,0,TC,3',
  'CSC13106,Kiến trúc phần mềm,4,45,30,0,TC,3',
  'CSC13112,Thiết kế giao diện,4,45,30,0,TC,3',
  'CSC10101,Kỹ năng mềm,3,30,45,0,TC,3',
  'CSC10102,Kiến tập nghề nghiệp,2,15,30,0,TC,3',
  'CSC10103,Khởi nghiệp,3,30,30,0,TC,3',
  'CSC10104,Quy hoạch tuyến tính,4,45,30,0,TC,3',
  'CSC10105,Nhập môn tư duy thuật toán,4,45,30,0,TC,3',
  'CSC10106,Thuật toán tổ hợp và ứng dụng,4,45,30,0,TC,3',
  'CSC10107,Thực tập thực tế,4,30,60,0,TC,3',
  'CSC13001,Lập trình Windows,4,45,30,0,TC,3',
  'CSC13101,Các chủ đề nâng cao trong Công nghệ phần mềm,4,45,30,0,TC,3',
  'CSC13102,Lập trình ứng dụng Java,4,45,30,0,TC,3',
  'CSC13103,Công nghệ Java cho hệ thống phân tán,4,45,30,0,TC,3',
  'CSC13107,Mẫu thiết kế hướng đối tượng và ứng dụng,4,45,30,0,TC,3',
  'CSC13108,Mô hình hóa phần mềm,4,45,30,0,TC,3',
  'CSC14005,Nhập môn học máy,4,45,30,0,TC,3',
  'CSC16106,Nhập môn lập trình điều khiển thiết bị thông minh,4,45,30,0,TC,3',
  'CSC10251,Khóa luận tốt nghiệp,10,0,300,0,TC,4',
  'CSC10252,Thực tập tốt nghiệp,10,0,300,0,TC,4',
  'CSC10204,Thực tập dự án tốt nghiệp,6,0,180,0,TC,4',
  'CSC13114,Phát triển ứng dụng web nâng cao,4,45,30,0,TC,4',
  'CSC13115,Các công nghệ mới trong phát triển phần mềm,4,45,30,0,TC,4',
  'CSC13116,Đồ án Công nghệ phần mềm,4,45,30,0,TC,4',
  'CSC13117,Phát triển game nâng cao,4,45,30,0,TC,4',
  'CSC13118,Phát triển ứng dụng cho thiết bị di động nâng cao,4,45,30,0,TC,4',
].map((item, index) => {
  const [
    courseCode,
    name,
    credits,
    theoryLessons,
    practiceLessons,
    exerciseLessons,
    courseRequired,
    knowledgeBlockId,
  ] = item.split(',');

  return {
    id: index + 1,
    courseCode,
    name,
    credits,
    isRequired: courseRequired === 'BB',
    knowledgeBlockId,
    theoryLessons,
    practiceLessons,
    exerciseLessons,
  };
});
/*
const splitter2 = (raw) => raw.map((item) => item.split("").reverse().join("").split(" ", 6).map((i) => i.split("").reverse().join(""))).map((item, idx) => { const lastItem=item.at(-1); const lastItemIdx = raw[idx].search(lastItem) + lastItem.length; item[5] = raw[idx].substring(0, lastItemIdx); return item.reverse(); }).map((i) => i.join(','))
 */
