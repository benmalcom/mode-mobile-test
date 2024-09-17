import { ethers } from 'ethers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { message, signature, address } = await request.json();
  try {
    // Verify the message was signed by the wallet's private key
    const recoveredAddress = ethers.verifyMessage(message, signature);
    // Check if the recovered address matches the expected address
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json(
      { success: false, error: 'Signature mismatch' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
