import {
  TrendingDown,
  TrendingUp,
  Schedule,
  PermIdentity,
} from "@mui/icons-material";
import { formatDateSpanish, formaTime } from "../../assets/constants.d";
export default function Card({
  motivo,
  autor,
  unidadMedida,
  correoAutor,
  fecha,
  cantidad,
  tela,
}) {
  return (
    <section className="card-control-insumo">
      <div className="header-card">
        <div className="header-insumo">
          <span className="tela">"{tela}"</span>
          {cantidad < 0 ? (
            <TrendingDown
              sx={{ marginBottom: "5px" }}
              color="error"
            ></TrendingDown>
          ) : (
            <TrendingUp
              sx={{ marginBottom: "5px" }}
              color="success"
            ></TrendingUp>
          )}

          <h4>
            {" "}
            <span
              className={
                cantidad < 0
                  ? "cantidad-insumo-error"
                  : "cantidad-insumo-success"
              }
            >
              {`${Math.abs(cantidad)} ${unidadMedida}`}
            </span>{" "}
          </h4>
        </div>
        <div className="fecha-autor">
          <Schedule sx={{ marginBottom: "5px" }}></Schedule>
          <span>{`${formatDateSpanish(fecha)} ${formaTime(fecha)}`} |</span>
          <PermIdentity sx={{ marginBottom: "5px" }}></PermIdentity>
          <span title={correoAutor} className="name">
            {autor}
          </span>
        </div>
      </div>
      <div className="motivo-card">
        <span>{motivo}</span>
      </div>
    </section>
  );
}
