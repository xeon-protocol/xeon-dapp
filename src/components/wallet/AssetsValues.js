function AssetsValues({ label, value }) {
  return (
    <div className="w-full my-4">
      <div className="flex items-center w-full lg:w-[300px] justify-between">
        <p className="flex text-lg items-center text-muted">
          <span className="text-4xl">{`{`}</span>
          {label}
        </p>
        <div className="flex ml-2 items-center">
          <span className="text-lime lg:text-xl text-sm text-right">
            ${value}
          </span>

          <span className="text-4xl text-muted">{`}`}</span>
        </div>
      </div>
    </div>
  );
}

export default AssetsValues;
