import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { sendInvoiceEmail } from '@/lib/email';
import Invoice from '@/models/invoiceModel';
import CreditCard from '@/models/creditCardModel';
import Users from '@/models/userModel';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();
    const {
      clientID,
      freeLancerID,
      username,
      cardNumber,
      expiryDate,
      securityCode,
      firstName,
      lastName,
      jobFee,
    } = body;

    if (!/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json(
        { message: 'Invalid card number. Must be 16 digits.' },
        { status: 400 }
      );
    }

    if (!/^\d{2}\/\d{2}\/\d{2}$/.test(expiryDate)) {
      return NextResponse.json(
        { message: 'Invalid expiry date. Use MM/DD/YY format.' },
        { status: 400 }
      );
    }

    if (!/^\d{3,4}$/.test(securityCode)) {
      return NextResponse.json(
        { message: 'Invalid security code. Must be 3 or 4 digits.' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return NextResponse.json(
        { message: 'First name must contain only letters.' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return NextResponse.json(
        { message: 'Last name must contain only letters.' },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedCardNumber = await bcrypt.hash(cardNumber, saltRounds);
    const hashedExpiryDate = await bcrypt.hash(expiryDate, saltRounds);
    const hashedSecurityCode = await bcrypt.hash(securityCode, saltRounds);

    const year = new Date().getFullYear().toString();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const transactionID = `${year}${randomHex}`;

    await Invoice.create({
      clientID,
      freeLancerID,
      transactionID,
    });

    const existingCard = await CreditCard.findOne({ userID: clientID });

    if (existingCard) {
      existingCard.cardNumber = hashedCardNumber;
      existingCard.expiryDate = hashedExpiryDate;
      existingCard.securityCode = hashedSecurityCode;
      existingCard.firstName = firstName;
      existingCard.lastName = lastName;
      await existingCard.save();
    } else {
      await CreditCard.create({
        userID: clientID,
        cardNumber: hashedCardNumber,
        expiryDate: hashedExpiryDate,
        securityCode: hashedSecurityCode,
        firstName,
        lastName,
      });
    }

    const serviceFee = 2.5;
    const totalFee = jobFee + serviceFee;

    const user = await Users.findById(clientID);
    if (user) {
      await sendInvoiceEmail(
        user.email,
        username,
        jobFee,
        serviceFee,
        transactionID,
        totalFee
      );
    }

    const invoice = await Invoice.findOne({ transactionID });

    return NextResponse.json(
      { message: 'Payment processed', invoice },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { message: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
