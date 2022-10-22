import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IEstadistica } from './model/estadistica';
import { IPictogramaEstadistica } from './model/pictogramaEstadistica';
import { ObtenerPictogramaConImagenes, ObtenerPictogramasConImagenes } from '../pictogramas/services/pictogramas-services';



export default function TimeLine(props: any){

  const [pictogramasMañana, setPictogramasMañana] = useState([] as IPictogramaEstadistica[])
  const [pictogramasMediodia, setPictogramasMediodia] = useState([] as IPictogramaEstadistica[])
  const [pictogramasTarde, setPictogramasTarde] = useState([] as IPictogramaEstadistica[])
  const [pictogramasNoche, setPictogramasNoche] = useState([] as IPictogramaEstadistica[])

  useEffect(() => {
    let estadisticas = props.estadisticas as IEstadistica[]
    let mañana = estadisticas.filter(e => new Date(e.fecha).getHours() >= 6 && new Date(e.fecha).getHours() < 12)
    let mediodia = estadisticas.filter(e => new Date(e.fecha).getHours() >= 12 && new Date(e.fecha).getHours() < 16)
    let tarde = estadisticas.filter(e => new Date(e.fecha).getHours() >= 16 && new Date(e.fecha).getHours() < 20)
    let noche = estadisticas.filter(e =>new Date(e.fecha).getHours() >= 20 && new Date(e.fecha).getHours() < 2)

    ObtenerPictogramasOrdenados(mañana).then(pics => {
      setPictogramasMañana(pics)
    })
    ObtenerPictogramasOrdenados(mediodia).then(pics => {
      setPictogramasMañana(pics)
    })
    ObtenerPictogramasOrdenados(tarde).then(pics => {
      setPictogramasMañana(pics)
    })
    ObtenerPictogramasOrdenados(noche).then(pics => {
      setPictogramasMañana(pics)
    })
  },[])

  async function ObtenerPictogramasOrdenados(estadisticas: IEstadistica[]) : Promise<IPictogramaEstadistica[]>{
    let pictogramas = [] as IPictogramaEstadistica[]
    estadisticas.forEach(async (estadistica) => {
      if(pictogramas.some((p: IPictogramaEstadistica) => p.id === estadistica.pictograma)){
        // Ya existe, debo aumentar su contador
        pictogramas.map(p => {
          if(p.id === estadistica.pictograma){
            p.cantidad += 1
            p.estadisticas.push(estadistica)
          }
        })
      }
      else{
        // Lo agrego a la lista  
        let pictograma = await ObtenerPictogramaConImagenes(estadistica.pictograma)      
        pictogramas.push({
          cantidad: 1,
          estadisticas: [estadistica],
          id: estadistica.pictograma,
          pictograma: pictograma
        })
      }
    });

    pictogramas.sort(p => p.cantidad).slice(0,5)
    console.log("PICTOGRAMAS DE ESTADISTICA: ", pictogramas)

    return pictogramas
  }

  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          6:00 a 11:00
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot>
            <FastfoodIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography variant="h6" component="span">
            Eat
          </Typography>
          <Typography>Because you need strength</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          variant="body2"
          color="text.secondary"
        >
          12:00 a 15:00
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary">
            <LaptopMacIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography variant="h6" component="span">
            Code
          </Typography>
          <Typography>Because it&apos;s awesome!</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary" variant="outlined">
            <HotelIcon />
          </TimelineDot>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography variant="h6" component="span">
            Sleep
          </Typography>
          <Typography>Because you need rest</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
          <TimelineDot color="secondary">
            <RepeatIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography variant="h6" component="span">
            Repeat
          </Typography>
          <Typography>Because this is the life you love!</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}