"""
Logging configuration for the Dog API backend.
Creates date-based log folders with separate files for each log level.
"""

import logging
import os
from datetime import datetime
from pathlib import Path


def setup_logging():
    """
    Sets up logging with separate files for different log levels.
    Creates structure: logs/YYYY-MM-DD/{DEBUG,INFO,WARNING,ERROR,ALL}.log
    """
    # Get the project root (parent of backend)
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent

    # Create logs directory with today's date
    today = datetime.now().strftime("%Y-%m-%d")
    log_dir = project_root / "logs" / today
    log_dir.mkdir(parents=True, exist_ok=True)

    # Define log file paths
    log_files = {
        "DEBUG": log_dir / "DEBUG.log",
        "INFO": log_dir / "INFO.log",
        "WARNING": log_dir / "WARNING.log",
        "ERROR": log_dir / "ERROR.log",
        "ALL": log_dir / "ALL.log",
    }

    # Create formatters
    detailed_formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(funcName)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    simple_formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)  # Capture all levels

    # Remove any existing handlers
    root_logger.handlers.clear()

    # Create handlers for each log level
    handlers = []

    # ALL - captures everything
    all_handler = logging.FileHandler(log_files["ALL"])
    all_handler.setLevel(logging.DEBUG)
    all_handler.setFormatter(detailed_formatter)
    handlers.append(all_handler)

    # DEBUG - only debug messages
    debug_handler = logging.FileHandler(log_files["DEBUG"])
    debug_handler.setLevel(logging.DEBUG)
    debug_handler.addFilter(lambda record: record.levelno == logging.DEBUG)
    debug_handler.setFormatter(detailed_formatter)
    handlers.append(debug_handler)

    # INFO - only info messages
    info_handler = logging.FileHandler(log_files["INFO"])
    info_handler.setLevel(logging.INFO)
    info_handler.addFilter(lambda record: record.levelno == logging.INFO)
    info_handler.setFormatter(simple_formatter)
    handlers.append(info_handler)

    # WARNING - only warning messages
    warning_handler = logging.FileHandler(log_files["WARNING"])
    warning_handler.setLevel(logging.WARNING)
    warning_handler.addFilter(lambda record: record.levelno == logging.WARNING)
    warning_handler.setFormatter(detailed_formatter)
    handlers.append(warning_handler)

    # ERROR - error and critical messages
    error_handler = logging.FileHandler(log_files["ERROR"])
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    handlers.append(error_handler)

    # Console handler - show INFO and above in console
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    handlers.append(console_handler)

    # Add all handlers to root logger
    for handler in handlers:
        root_logger.addHandler(handler)

    # Log initialization
    logging.info(f"Logging initialized. Logs directory: {log_dir}")
    logging.debug(f"Log files created: {list(log_files.keys())}")

    return root_logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.

    Args:
        name: Usually __name__ of the calling module

    Returns:
        Logger instance
    """
    return logging.getLogger(name)
