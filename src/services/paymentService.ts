import { AppDataSource } from "../config/DataSource.ts";
import { CreatePaymentDtoType, UpdatePaymentStatusDtoType } from "../dtos/payment/paymentInputDto.ts";
import {
  PaymentResponseDto,
  PaymentResponseDtoType,
} from "../dtos/payment/paymentResponseDto.ts";
import { Payment, Status, statusArray } from "../models/Payment.ts";

class PaymentService {
  private paymentRepo = AppDataSource.getRepository(Payment);

  async getAllPayments(): Promise<PaymentResponseDtoType[]> {
    const savedPayment = await this.paymentRepo.find({
      relations: ["user", "course"],
      order: { createdAt: "DESC" },
    });

    return savedPayment.map((savedPayment) =>
      PaymentResponseDto.parse(savedPayment)
    );
  }

  async createPayment(
    userId: number,
    paymentData: CreatePaymentDtoType
  ): Promise<PaymentResponseDtoType> {
    const payment = this.paymentRepo.create({
      user: { id: userId },
      course: { id: paymentData.courseId },
      amount: paymentData.amount,
      status: "pending" as Status,
    });

    const savedPayment = await this.paymentRepo.save(payment);
    const paymentWithRelations = await this.paymentRepo.findOne({
      where: { id: savedPayment.id },
      relations: ["user", "course"],
    });

    return PaymentResponseDto.parse(paymentWithRelations);
  }

  async getPaymentsByUser(userId: number): Promise<PaymentResponseDtoType[]> {
    const payment = await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ["course"],
    });

    return payment.map((payment) => PaymentResponseDto.parse(payment));
  }

  async updatePaymentStatus(paymentId: number, paymentData: UpdatePaymentStatusDtoType): Promise<PaymentResponseDtoType> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["user", "course"],
    });
    if (!payment) throw new Error("Payment not found");

    payment.status = paymentData.status;
    const savedPayment =  await this.paymentRepo.save(payment);

    return PaymentResponseDto.parse(savedPayment);
  }

  async hasAccess(userId: number, courseId: number): Promise<boolean> {
    const payment = await this.paymentRepo.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
        status: "completed",
      },
    });

    return payment !== null;
  }
}

export const paymentService = new PaymentService();
