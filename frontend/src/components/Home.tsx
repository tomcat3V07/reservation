import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบจองห้องพัก</h1>
        <h4>Requirements</h4>
        <p>
        โรงแรมอัครเดชเป็นโรงแรมที่ลูกค้าที่ต้องการเข้าพัก
        สามารถทำการจองห้องพักได้อย่างสะดวกสบายและรวดเร็ว
        ผ่านทางเว็บไซต์ของโรงแรม
        โดยลูกค้าที่เป็นสมาชิกสามารถระบุช่วงวันเวลาที่ต้องการเข้าพัก
        ห้องที่ต้องการเข้าพัก รวมถึงต้องระบุจำนวนคนที่ต้องการเข้าพักด้วย
        ซึ่งระบบจะทำการบันทึกข้อมูลการจองเมื่อลูกค้ายืนยันข้อมูลแล้ว
        </p>
      </Container>
    </div>
  );
}
export default Home;