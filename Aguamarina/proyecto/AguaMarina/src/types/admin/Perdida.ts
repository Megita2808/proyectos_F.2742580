export type Perdida = {
    id_loss: number;
    id_user: number;
    loss_date: Date;
    observations: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    lossDetails: any[];
  };