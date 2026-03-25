/**
 * Chuẩn hóa format response cho API
 * @param {Object} data Dữ liệu trả về
 * @param {String} message Tin nhắn mô tả
 * @param {Object} meta Thông tin pagination (nếu có)
 * @returns {Object} JSON format
 */
const successResponse = (data = {}, message = 'OK', meta = null) => {
  const response = {
    success: true,
    data,
    message,
  };
  if (meta) {
    response.meta = meta;
  }
  return response;
};

/**
 * Chuẩn hóa format error cho API
 * @param {String} message Tin nhắn lỗi
 * @param {Object|Array} errors Chi tiết lỗi (nếu có)
 * @returns {Object} JSON format
 */
const errorResponse = (message = 'Lỗi hệ thống', errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};
