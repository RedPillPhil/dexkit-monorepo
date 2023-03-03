import { SwapConfig } from '@/modules/swap/types';
import {
  Alert,
  Container,
  Divider,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NetworkSelectDropdown } from 'src/components/NetworkSelectDropdown';
import { SearchTokenAutocomplete } from '../pageEditor/components/SearchTokenAutocomplete';

interface Props {
  data?: SwapConfig;
  onChange?: (data: SwapConfig) => void;
}

export function SwapConfigForm({ onChange, data }: Props) {
  const [formData, setFormData] = useState<SwapConfig | undefined>(data);
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    data?.defaultChainId
  );
  const sellToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.defaultSellToken;
    }
  }, [selectedChainId, formData]);

  const buyToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.defaultBuyToken;
    }
  }, [selectedChainId, formData]);

  const slippage = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.slippage || '';
    }
  }, [selectedChainId, formData]);

  useEffect(() => {
    if (onChange && formData) {
      onChange(formData);
    }
  }, [formData, onChange]);

  return (
    <Container sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="default.network.info.swap.form"
              defaultMessage="Default network when wallet is not connected"
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="caption">
              <FormattedMessage
                id="default.network"
                defaultMessage="Default network"
              />
            </Typography>
            <NetworkSelectDropdown
              chainId={formData?.defaultChainId}
              onChange={(chainId) => {
                setFormData({
                  ...formData,
                  defaultChainId: chainId,
                });
              }}
              labelId={'default-network'}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Divider></Divider>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="network.swap.options.info"
              defaultMessage="Choose the default tokens and slippage for each network."
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="caption">
              <FormattedMessage id="network" defaultMessage="Network" />
            </Typography>
            <NetworkSelectDropdown
              onChange={(chainId) => {
                setSelectedChainId(chainId);
                setFormData({
                  ...formData,
                  defaultEditChainId: chainId,
                });
              }}
              labelId={'config-per-network'}
              chainId={selectedChainId}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <SearchTokenAutocomplete
            chainId={selectedChainId}
            disabled={selectedChainId === undefined}
            label={
              <FormattedMessage
                id="search.default.input.token"
                defaultMessage="Search default input token"
              />
            }
            data={buyToken}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData;
                if (formData?.configByChain) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }
                setFormData({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      defaultBuyToken: tk,
                    },
                  },
                });
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <SearchTokenAutocomplete
            label={
              <FormattedMessage
                id="search.default.output.token"
                defaultMessage="Search default output token"
              />
            }
            disabled={selectedChainId === undefined}
            data={sellToken}
            chainId={selectedChainId}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData;
                if (formData?.configByChain) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }
                setFormData({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      defaultSellToken: tk,
                    },
                  },
                });
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            inputProps={{ type: 'number', min: 0, max: 50, step: 0.01 }}
            InputLabelProps={{ shrink: true }}
            disabled={selectedChainId === undefined}
            label={
              <FormattedMessage
                id="default.slippage.percentage"
                defaultMessage="Default slippage (0-50%)"
              />
            }
            value={slippage}
            onChange={(event: any) => {
              if (selectedChainId) {
                let value = event.target.value;
                if (value < 0) {
                  value = 0;
                }
                if (value > 50) {
                  value = 50;
                }

                let oldFormData;
                if (formData?.configByChain) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }
                setFormData({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      slippage: value,
                    },
                  },
                });
              }
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
}
