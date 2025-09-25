import { AppDataSource } from "../config/DataSource.ts";
import { Payment, Status, statusArray } from "../models/Payment.ts";
class PaymentService {
  private paymentRepo = AppDataSource.getRepository(Payment);

  async getAllPayments() {
    return await this.paymentRepo.find({
      relations: ["user", "course"],
      order: { createdAt: "DESC" },
    });
  }

  async createPayment(userId: number, courseId: number, amount: number) {
    const payment = this.paymentRepo.create({
      user: { id: userId },
      course: { id: courseId },
      amount,
      status: "pending" as Status,
    });

    return await this.paymentRepo.save(payment);
  }

  async getPaymentsByUser(userId: number) {
    return await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ["course"],
    });
  }

  async updatePaymentStatus(paymentId: number, status: Status) {
    if (!statusArray.includes(status)) {
      throw new Error("Invalid status");
    }
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
    });
    if (!payment) throw new Error("Payment not found");

    payment.status = status;
    
    return await this.paymentRepo.save(payment);
  }

  async hasAccess(userId: number, courseId: number) {
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