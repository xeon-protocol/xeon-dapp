function LeftBottomWethValue({ line1, line2, value }) {
  return (
    <div className="flex justify-between items-center w-[100%] mb-3">
      <span className="flex items-center">
        <div className="text-5xl font-light text-muted leading-none mr-2">
          {'{'}
        </div>
        <div className="inline-block text-muted text-sm">
          <p>{line1}</p>
          <p>{line2}</p>
        </div>
      </span>

      <div>
        <span className="flex items-center">
          <div className="inline-block text-lg text-grey">
            <p>{value}</p>
          </div>
          <div className="text-5xl font-light text-muted leading-none mr-2">
            {'}'}
          </div>
        </span>
      </div>
    </div>
  );
}

export default LeftBottomWethValue;
