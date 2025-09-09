import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  loading?: boolean;
  error?: string;
  title?: string;
  description?: string;
  showResend?: boolean;
}

export function OTPInput({ 
  length = 6, 
  onComplete, 
  onResend,
  loading = false,
  error,
  title = "Enter OTP",
  description = "Please enter the 6-digit OTP",
  showResend = true
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
      
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split("").concat(new Array(length - pastedData.length).fill(""));
    setOtp(newOtp);
    
    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  const clearOTP = () => {
    setOtp(new Array(length).fill(""));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(index)}
              disabled={loading}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg bg-background focus:outline-none transition-colors ${
                activeIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : error
                  ? "border-red-500"
                  : "border-muted-foreground/30 focus:border-primary"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearOTP}
            disabled={loading}
          >
            Clear
          </Button>
          
          {showResend && onResend && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResend}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Resend OTP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface OTPDisplayProps {
  otp: string;
  title?: string;
  description?: string;
  onCopy?: () => void;
}

export function OTPDisplay({ 
  otp, 
  title = "Your Event OTP", 
  description = "Save this OTP to manage your event later",
  onCopy 
}: OTPDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      toast({
        title: "OTP Copied",
        description: "OTP has been copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
      
      if (onCopy) onCopy();
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy OTP to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatOTP = (otp: string) => {
    return otp.replace(/(\d{3})(\d{3})/, '$1 $2');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-primary tracking-widest">
              {formatOTP(otp)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full"
          variant={copied ? "default" : "outline"}
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy OTP
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• Keep this OTP safe and secure</p>
          <p>• You'll need it to edit or delete your event</p>
          <p>• OTP expires in 30 minutes from creation</p>
        </div>
      </CardContent>
    </Card>
  );
}