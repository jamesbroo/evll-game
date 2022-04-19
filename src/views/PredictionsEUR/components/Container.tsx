import styled from 'styled-components'

// background: ${({ theme }) => theme.colors.gradients.violetAlt};
// background: #111520;

const Container = styled.div`
  background-image: url("bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: calc(100vh - 100px);
  overflow: hidden;
  position: relative;
`

export default Container
