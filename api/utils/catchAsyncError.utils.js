export default function catchAsyncError(func) {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
}
