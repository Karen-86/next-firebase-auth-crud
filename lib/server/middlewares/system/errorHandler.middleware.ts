import { NextResponse } from "next/server";

function errorHandler(err: any) {
  console.error(`Error: ${err}`);

  return NextResponse.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
      data: err.data,
    },
    { status: err.statusCode || err.status || 500 },
  );
}

export default errorHandler;
