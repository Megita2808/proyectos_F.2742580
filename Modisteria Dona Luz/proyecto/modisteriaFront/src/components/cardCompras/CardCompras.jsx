import { Business, Inventory, ShoppingCart } from "@mui/icons-material";
import {
  formatDateSpanish,
  formaTime,
  formToCop,
  toggleState,
} from "../../assets/constants.d";
import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Transition from "../transition/Transition";
import DialogTitleCustom from "../dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../customDialogActions/CustomDialogActions";
import dayjs from "dayjs";

export default function CardCompras({ compra }) {
  console.log(compra);

  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <article className="compra" key={compra.id}>
        <div className="card-header">
          <div className="icono-compra-container">
            <ShoppingCart className="icono-compra" />
          </div>
          {`${dayjs(compra.fecha).format("D [de] MMMM [de] YYYY, h:mm A")}`}
        </div>
        <div className="card-body">
          <span className="action-text">Proveedor</span>
          <div className="proveedor">
            <Business className="icono-body" />
            <span>{compra.proveedor.nombre}</span>
          </div>
          <div className="insumos">
            <Inventory className="icono-body" />
            <span onClick={() => toggleState(setOpenModal)}>Ver insumos</span>
          </div>
        </div>
        <div className="valor">
          <span>{formToCop(compra.valorTotal)}</span>
        </div>
      </article>
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(setOpenModal)}
      >
        <DialogTitleCustom>Insumos comprados</DialogTitleCustom>
        <DialogContent>
          {compra.insumos.length > 0 &&
            compra.insumos.map((insumo) => (
              <div className="compra-card">
                <div class="campo">
                  <label>Insumo:</label>
                  <span>
                    {`${insumo.nombre} ${insumo.CompraInsumos.cantidad} ${
                      insumo.unidades_de_medida.nombre
                    } por ${formToCop(insumo.CompraInsumos.precio)}`}
                  </span>
                </div>
              </div>
            ))}
        </DialogContent>
        <CustomDialogActions
          cancelButton
          handleClose={() => {
            toggleState(setOpenModal);
          }}
        />
      </Dialog>
    </>
  );
}
